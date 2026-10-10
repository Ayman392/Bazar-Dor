import Hero from "@/components/Hero/Hero";
import PriceFallers from "@/components/PriceFallers/PriceFallers";
import PriceRisers from "@/components/PriceRisers/PriceRisers";

export default function Home() {
  return (
   <div>
    <Hero/>
    <PriceRisers/>
    <PriceFallers/>
   </div>
  );
}
