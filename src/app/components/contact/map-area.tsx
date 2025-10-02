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

"use client"
import React, { useState } from "react";

type MapLocations = 'office' | 'editing';

interface MapData {
  office: string;
  editing: string;
}

const MapArea: React.FC = () => {
  const [activeMap, setActiveMap] = useState<MapLocations>('office');

  const maps: MapData = {
    office: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.125794977999!2d72.85248407473804!3d19.233348647014928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b100500788c9%3A0x3441fe526320f02e!2sStar%20Trade%20Centre!5e0!3m2!1sen!2sin!4v1758989256208!5m2!1sen!2sin",
    editing: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.328681276226!2d72.85714776645769!3d19.22450210977214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b0d39bfad4f7%3A0x95c89db78ab349d9!2sNav%20Ratna%20CHS!5e0!3m2!1sen!2sin!4v1758990274302!5m2!1sen!2sin"
  };

  return (
    <>
      <div className="container mt-5 mb-4" style={{ marginTop: '120px' }}>
        <div className="d-flex justify-content-center gap-3">
          <button 
            className={`btn-five ${activeMap === 'office' ? 'active-map-btn' : ''}`}
            onClick={() => setActiveMap('office')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: activeMap === 'office' ? '#1B3C2C' : '#f0f0f0',
              color: activeMap === 'office' ? '#ffffff' : '#1B3C2C',
              minWidth: '200px'
            }}
          >
            Office Address
          </button>
          <button 
            className={`btn-five ${activeMap === 'editing' ? 'active-map-btn' : ''}`}
            onClick={() => setActiveMap('editing')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: activeMap === 'editing' ? '#1B3C2C' : '#f0f0f0',
              color: activeMap === 'editing' ? '#ffffff' : '#1B3C2C',
              minWidth: '200px'
            }}
          >
            Editing Office Address
          </button>
        </div>
      </div>

      <div className="map-banner" style={{ height: '400px', width: '100%', position: 'relative' }}>
        <div className="gmap_canvas h-100 w-100">
          <iframe
            className="gmap_iframe"
            style={{ height: '100%', width: '100%', border: 0 }}
            src={maps[activeMap]}
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default MapArea;