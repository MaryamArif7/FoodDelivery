import { Nav } from "../common/nav";
export const Hero = () => {
  return (
    <>
    <Nav />
      <div className="flex " >
        <div>
         <h1 className="hero-heading font-extrabold">Food Rush: Where Great Taste Meets Speed</h1>
            <p className="hero-subheading">Experience the fastest food delivery in town. Quality meals from top-rated restaurants, delivered with care to satisfy your hunger instantly.</p>
            <a href="#" className="cta-button">Start Ordering</a>
        </div>
       <div>
        <img  src="/1.png"/>
       </div>
      </div>
    </>
  );
};
