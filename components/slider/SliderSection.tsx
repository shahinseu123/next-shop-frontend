import { getSliders } from "@/app/actions/product";
import SimpleSlider from "./SimpleSlider";
export default async function SliderSection() {
  const sliders = await getSliders();
  return <SimpleSlider sliders={sliders} />;
}