import Text from '../text';

export const Illustrator = ({ title, description, image, children }) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {image}
      {title ? (
        <Text as="h2" weight="bold" className="text-xl md:text-3xl">
          {title}
        </Text>
      ) : null}
      {description ? (
        <Text as="p" className="text-sm md:text-base">
          {description}
        </Text>
      ) : null}
      {children}
    </div>
  );
};
