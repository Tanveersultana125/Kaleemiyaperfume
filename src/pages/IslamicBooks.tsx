import Shop from "./Shop";

const IslamicBooks = () => {
  return (
    <Shop 
      title="Islamic Books" 
      subtitle="A curated selection of literature in English, Roman, and Urdu to enlighten the mind and nourish the soul."
      initialProductCategory="books"
      extraCategories={["english", "roman", "urdu"]}
      hideGenderFilters={true}
    />
  );
};

export default IslamicBooks;
