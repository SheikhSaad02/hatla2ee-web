import { decodeHTMLEntities } from '@/utils/general';
import React from 'react';

function htmlStringToJSX(htmlString) {
  if (!htmlString || typeof htmlString !== 'string') {
    return null;
  }

  const parseStyleString = (styleString) => {
    const styleObj = {};
    if (!styleString) return styleObj;

    styleString.split(';').forEach((declaration) => {
      const [property, value] = declaration.split(':').map((s) => s.trim());
      if (property && value) {
        const camelCaseProperty = property.replace(/-([a-z])/g, (_, letter) =>
          letter.toUpperCase(),
        );
        styleObj[camelCaseProperty] = value;
      }
    });

    return styleObj;
  };

  const parseAttributes = (tagString) => {
    const attrs = {};

    const attrRegex = /(\w+(?:-\w+)*)=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
    let match;

    while ((match = attrRegex.exec(tagString)) !== null) {
      const attrName = match[1];
      const attrValue = match[2] || match[3] || match[4];

      if (attrName === 'class') {
        attrs.className = attrValue;
      } else if (attrName === 'for') {
        attrs.htmlFor = attrValue;
      } else if (attrName === 'style') {
        attrs.style = parseStyleString(attrValue);
      } else if (attrName.includes('-')) {
        if (attrName.startsWith('data-') || attrName.startsWith('aria-')) {
          attrs[attrName] = attrValue;
        } else {
          const camelCase = attrName.replace(/-([a-z])/g, (_, letter) =>
            letter.toUpperCase(),
          );
          attrs[camelCase] = attrValue;
        }
      } else {
        attrs[attrName] = attrValue;
      }
    }

    return attrs;
  };

  const processHTML = (html) => {
    if (!html) return null;

    const elements = [];
    let position = 0;

    while (position < html.length) {
      const tagStart = html.indexOf('<', position);

      if (tagStart === -1) {
        const remainingText = html.substring(position);
        if (remainingText) {
          elements.push(decodeHTMLEntities(remainingText));
        }
        break;
      }

      if (tagStart > position) {
        const textContent = html.substring(position, tagStart);
        if (textContent) {
          elements.push(decodeHTMLEntities(textContent));
        }
      }

      const tagEnd = html.indexOf('>', tagStart);
      if (tagEnd === -1) break;

      const tagContent = html.substring(tagStart + 1, tagEnd);
      const spaceIndex = tagContent.search(/\s/);
      const tagName =
        spaceIndex === -1 ? tagContent : tagContent.substring(0, spaceIndex);
      const attributesString =
        spaceIndex === -1 ? '' : tagContent.substring(spaceIndex);

      if (
        !['img', 'iframe', 'span', 'strong', 'p'].includes(
          tagName.toLowerCase(),
        )
      ) {
        position = tagEnd + 1;
        continue;
      }

      if (
        tagContent.endsWith('/') ||
        tagName === 'img' ||
        tagName === 'iframe'
      ) {
        const props = parseAttributes(attributesString);
        props.key = elements.length;
        elements.push(React.createElement(tagName.toLowerCase(), props));
        position = tagEnd + 1;
      } else {
        const closingTag = `</${tagName}>`;
        let tagDepth = 1;
        let searchPos = tagEnd + 1;
        let contentStart = tagEnd + 1;
        let contentEnd = -1;

        while (searchPos < html.length && tagDepth > 0) {
          const nextOpenTag = html.indexOf(`<${tagName}`, searchPos);
          const nextCloseTag = html.indexOf(closingTag, searchPos);

          if (nextCloseTag === -1) break;

          if (nextOpenTag !== -1 && nextOpenTag < nextCloseTag) {
            tagDepth++;
            searchPos = nextOpenTag + tagName.length + 1;
          } else {
            tagDepth--;
            if (tagDepth === 0) {
              contentEnd = nextCloseTag;
            }
            searchPos = nextCloseTag + closingTag.length;
          }
        }

        if (contentEnd !== -1) {
          const content = html.substring(contentStart, contentEnd);

          const props = parseAttributes(attributesString);
          props.key = elements.length;

          const children = processHTML(content);
          elements.push(
            React.createElement(tagName.toLowerCase(), props, children),
          );

          position = contentEnd + closingTag.length;
        } else {
          position = tagEnd + 1;
        }
      }
    }

    return elements.length === 0
      ? null
      : elements.length === 1
      ? elements[0]
      : elements;
  };

  return processHTML(htmlString);
}

export { htmlStringToJSX };
