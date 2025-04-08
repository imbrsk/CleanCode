import * as React from "react";
import "../css/about.css";

function AboutUs() {
  return (
    <>
      <div className="">
        <div className="mission">
          <div>
            <h1>Our mission:</h1>
            <p>
              At CleanCode, our mission is to empower computer science students
              to excel in their academic pursuits and professional endeavors by
              providing a comprehensive platform for practicing coding examples.
              We understand the challenges students face in preparing for exams
              and interviews, and we strive to alleviate these challenges by
              offering a robust repository of coding problems and solutions.
            </p>
          </div>
          <div><img src="\public\mission.jpg" alt="" /> </div>
        </div>

        <div className="vision">
          <div><img src="\public\vision.jpg" alt="" /></div>
          <div>
          <h1>Our vision:</h1>
          <p>
            Our vision is to become the go-to destination for computer science
            students seeking to enhance their coding skills and readiness for
            exams and interviews. We envision a future where every student has
            access to high-quality coding practice materials that are both
            challenging and educational. Through continuous innovation and
            dedication to excellence, we aim to foster a community of aspiring
            developers who are well-prepared to tackle the challenges of the
            ever-evolving tech industry. At CleanCode, we are committed to
            empowering the next generation of coders, engineers, and innovators
            to realize their full potential and make meaningful contributions to
            the world of technology. Join us on this journey towards excellence
            in coding proficiency and career readiness.
          </p>
          
          </div>
        </div>


        <div className="values">

          <div>
            
          <h1>Our value:</h1>
          <ul>
            <li>
              Commitment to Excellence: We are dedicated to maintaining the
              highest standards of quality in everything we do, from the coding
              problems we curate to the user experience we provide. Excellence
              is at the core of our values, driving us to continuously improve
              and innovate.
            </li>
            <li>
              Accessibility: We believe that every aspiring computer scientist
              should have access to high-quality coding practice materials
              regardless of their background or financial means. We are
              committed to making our platform accessible and inclusive to all
              learners.
            </li>
            <li>
              Community Engagement: We recognize the importance of community
              support and collaboration in fostering learning and growth. We
              actively encourage interaction, feedback, and knowledge-sharing
              among our users to create a vibrant and supportive learning
              community.
            </li>
            <li>
              Empowerment: We empower students to take control of their learning
              journey by providing them with the tools, resources, and guidance
              they need to succeed. We believe in equipping our users with the
              skills and confidence to tackle coding challenges with ease.
            </li>
            <li>
              Integrity: Honesty, transparency, and integrity are fundamental to
              our operations. We uphold ethical principles in all aspects of our
              business, ensuring trust and reliability in our interactions with
              users, partners, and stakeholders.
            </li>
            <li>
              Continuous Learning: In the dynamic field of computer science,
              learning never stops. We promote a culture of lifelong learning
              and professional development, encouraging our users to continually
              challenge themselves and expand their knowledge and skills.
            </li>
          </ul>
          At CleanCode, these values guide our decisions, actions, and
          relationships as we strive to fulfill our mission and realize our
          vision of empowering computer science students worldwide.
          
          </div>
        <div><img src="\public\values.jpg" alt="" /></div>
        
        </div>
      </div>

      <div>
        <h1>About the Founders:</h1>
        <div className="founders">
          <div className="stefan">
            <img src="\public\stefan.jpg" alt="Stefan" />
            <span>Stefan Saveski</span>
          </div>
          <div className="boris">
            <img src="\public\boris.jpg" alt="Boris" />
            <span>Boris Gjorgievski</span>
          </div>
        </div>
      </div>

      <div>
        <h1>Partners and supporters:</h1>
        <div className="partners">
          <div className="finki">
            <img src="\public\sponsors_supporters\finki.png" alt="finki" />
            <span>FINKI</span>
          </div>
          <div className="finki">
            <img src="\public\sponsors_supporters\mkhost.png" alt="mkhost" />
            <span>mkhost</span>
          </div>
          <div className="finki">
            <img src="\public\sponsors_supporters\eestec.png" alt="eestec" />
            <span>EESTEC LC Skopje</span>
          </div>
          <div className="finki">
            <img src="\public\sponsors_supporters\mkhost.png" alt="finki" />
            <span>FINKI</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
