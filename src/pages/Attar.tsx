import Shop from "./Shop";

const Attar = () => {
  return (
    <Shop 
      title="Pure Attars" 
      subtitle="Exquisite collection of premium concentrated oils, traditional bakhur, and aromatic agarbatti."
      initialProductCategory="attar"
      extraCategories={["attar", "bakhur", "agarbatti"]}
    />
  );
};

export default Attar;
