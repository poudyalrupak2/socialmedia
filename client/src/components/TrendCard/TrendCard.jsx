import React from 'react'
import './TrendCard.css'
import {SponsoredData} from '../../Data/TrendData.js'
const TrendCard = () => {
    return (
        <div className="TrendCard">
          <h3>Sponsored Ads</h3>
    
          {SponsoredData.map((ad) => (
            <div className="ad" key={ad.id}>
              <img src={ad.imageUrl} alt={ad.title} className="ad-image" />
              <div className="ad-content">
                <h4>{ad.title}</h4>
                <p>{ad.description}</p>
                <a href={ad.link} target="_blank" rel="noopener noreferrer" className="ad-link">
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      );
}

export default TrendCard