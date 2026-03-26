import Shop from "./Shop";

const GiftSets = () => {
  return (
    <Shop 
      title="Gifting" 
      subtitle="Exquisite collection of premium gifting items including Bukhurdans, Quran Boxes, and artisanal Tasbeehs."
      initialProductCategory="giftsets"
      extraCategories={["bukhurdan", "quran box", "tasbeeh"]}
    />
  );
};

export default GiftSets;
