import Updatecard from './Updatecard';
import '../css/updates.css'


function Siteupdates() {
  return (
    <>
      <div className="updates-title">Recent site updates</div>
      <div><Updatecard title = "New Problem Sets" color="#FF7F50" text1="Brace yourself for fresh challenges!"
      text2="We're introducing new problem sets across various CS"
      text3="subjects to keep your coding skills sharp."></Updatecard></div>
      <div><Updatecard title = "User Profiles" color="#3EB489" text1="Your coding journey, your profile. Soon, you'll be able "
      text2="to personalize your experience, track your progress, "
      text3="and showcase your coding achievements."></Updatecard></div>
      <div><Updatecard title = "Community Features" color="#5B5F97" text1="Get ready to connect! We're rolling out enhanced"
      text2="community features, making it easier for you to"
      text3="interact, collaborate, and learn from fellow coders."></Updatecard></div>
      <div><Updatecard title = "Mobile-Friendly Interface" color="#FF7F50" text1="Code on the go! Our platform is becoming even more"
      text2="mobile-friendly, ensuring a seamless coding"
      text3="experience across all your devices."></Updatecard></div>
      
    </>
  );
}

export default Siteupdates;
