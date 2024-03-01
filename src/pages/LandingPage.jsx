import { Link } from "react-router-dom";
import "../css/landingPage.css";
const LandingPage = () => {
  return (
    <main>
      <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active" data-bs-interval="10000">
            <img src="https://images.pexels.com/photos/6084474/pexels-photo-6084474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="d-block w-100" alt="slide1" />
            <div className="carousel-caption d-block header-content">
              <h1 className="text-start fw-bold">
                <div>learn</div>
                <div>with us</div>
              </h1>
              <p className="text-start">knowledge will bring you the opportunity to make a difference.</p>
              <Link to="/courses" className="browse">browse courses</Link>
            </div>
          </div>
          <div className="carousel-item" >
            <img src="https://images.pexels.com/photos/5711914/pexels-photo-5711914.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="d-block w-100" alt="slide2" />
            <div className="carousel-caption d-block header-content">
              <p className="text-start mt-5">"The function of education is to teach one to think intensively and to think critically. Intelligence plus character - that is the goal of true education."</p>
              <span className="d-block text-start"><i> -  Martin Luther King Jr</i></span>
            </div>
          </div>
          <div className="carousel-item">
            <img src="https://images.pexels.com/photos/6392975/pexels-photo-6392975.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="d-block w-100" alt="slide3" />
            <div className="carousel-caption d-block header-content">
              <p className="text-start mt-5">"The goal of education is not to increase the amount of knowledge but to create the possibilities for a child to invent and discover, to create men who are capable of doing new things."</p>
              <span className="d-block text-start"><i> - Jean Piaget</i></span>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </main>
  );
};

export default LandingPage;
