import { Nav } from "../common/nav";
export const Hero = () => {
  return (
    <>
    <Nav />
      <div className="flex gap-2" >
        <div>
         <h1 className="text-6xl hero-heading font-extrabold "> Fast Food  <br/> <span className="hero-span font-extrabold"> Fresh </span> Rush</h1>
            <p className="hero-subheading font-bold">Experience the fastest food delivery in town. <br/>Quality meals from top restaurants, delivered <br/> with care to satisfy your hunger instantly.
             
            </p>
            <button  className="cta-button">Start Ordering</button>
        </div>
       <div>
        <img className="w-96 h-96" src="/1.png" />
       </div>
      </div>
    </>
  );
};
