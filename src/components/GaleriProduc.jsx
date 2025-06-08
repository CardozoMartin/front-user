// GaleriProduc.jsx
const GaleriProduc = ({ data, marcaNombre }) => {
  const filterData = data?.filter((item) => item.marca === marcaNombre);

  return (
    <div>
      {filterData?.map((item, index) => (
        <p key={index}>{item.name}</p>
      ))}
    </div>
  );
};

export default GaleriProduc