import Shop from "./Shop";

const PrayerMats = () => {
  return (
    <Shop 
      title="Premium Prayer Mats" 
      subtitle="Exquisitely crafted prayer mats and Janimaaz designed for comfort and devotion."
      initialProductCategory="prayer mats"
      extraCategories={["janimaaz"]}
      hideGenderFilters={true}
    />
  );
};

export default PrayerMats;
