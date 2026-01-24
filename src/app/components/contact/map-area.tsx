// import React from "react";
// import Image from "next/image";
// import shape from "@/assets/images/shape/shape_02.svg";

// const MapArea = () => {
//   return (
//     <div className="inner-banner-one position-relative pb-0">
//       <div className="map-banner">
//         <div className="gmap_canvas h-100 w-100">
//           {/* <iframe
//             className="gmap_iframe h-100 w-100"
//             src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=bass hill plaza medical centre&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
//           ></iframe> */}

//           <iframe
//             className="gmap_iframe h-100 w-100"
//             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.125794977999!2d72.85248407473804!3d19.233348647014928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b100500788c9%3A0x3441fe526320f02e!2sStar%20Trade%20Centre!5e0!3m2!1sen!2sin!4v1758989256208!5m2!1sen!2sin">
//           </iframe>
//         </div>
//       </div>
//       <Image src={shape} alt="shape" className="lazy-img shapes shape_01" />
//     </div>
//   );
// };

// export default MapArea;

const MapArea: React.FC = () => {
  return (
    <div className="map-banner" style={{ height: '700px', width: '100%', position: 'relative', margin: 0, padding: 0, marginTop: '-26px' }}>
      <div className="gmap_canvas h-100 w-100">
        <iframe
          className="gmap_iframe"
          style={{ height: '100%', width: '100%', border: 0 }}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.125794977999!2d72.85248407473804!3d19.233348647014928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b100500788c9%3A0x3441fe526320f02e!2sStar%20Trade%20Centre!5e0!3m2!1sen!2sin!4v1758989256208!5m2!1sen!2sin"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default MapArea;