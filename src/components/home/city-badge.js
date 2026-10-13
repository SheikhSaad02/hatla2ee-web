import { ChipWithIcon } from "../common/chip-with-icon/chip-with-icon";

const BrowseByCities = ({ cities }) => {
  return (
    <div className="grid grid-rows-3 grid-flow-col gap-3 w-full h-full">
      {cities.map((city, index) => (
        <ChipWithIcon
          key={index}
          href={`/car/city/${city?._source?.slug}`}
          hrefTitle={city?._source?.title?.en}
          label={city?._source?.title?.en}
          className={"justify-center hover:bg-primary-50 hover:font-semibold"}
        />
      ))}
    </div>
  );
};
export default BrowseByCities;
