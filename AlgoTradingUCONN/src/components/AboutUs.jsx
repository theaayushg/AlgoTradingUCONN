import React from 'react';
import '../styles/AboutUs.css'; // Make sure to create this CSS file in the same directory

function AboutUs() {
    const teamMembers = [
        { name: 'Siddharth', role: 'CS Senior - Computational Data Analytics', description: 'Siddharth', image: '../../src/styles/Siddharth.jpg' },
        { name: 'Aayush', role: 'CS Senior - Computational Data Analytics', description: 'Aayush was the Team Manager for this project and focused on the web development along with research for this project.', image: '../../src/styles/aayush.PNG' },
        { name: 'Long', role: 'CS Senior - Cyber Security', description: 'Long.', image: '../../src/styles/long.PNG' },
        { name: 'Chenghe', role: 'CS Senior - Unspecialized', description: 'Chenghe.', image: '../../src/styles/chenghe.PNG' },
        { name: 'Sunwang', role: 'CS Senior - Computational Data Analytics', description: 'Sunwang.', image: '../../src/styles/sunwang.PNG' },
        { name: 'Ishan', role: 'CS Senior - Software Design Development', description: 'Ishan.', image: '../../src/styles/ishan.PNG' },
        { name: 'Ron', role: 'CS Senior - Unspecialized', description: 'Ron.', image: '../../src/styles/ron.PNG' }
    ];

    return (
    <div className="about-us">
      {teamMembers.map(member => (
        <div key={member.name} className="member">
          <img src={member.image} alt={member.name} style={{ width: '250px', height: 'auto' }} />
          <div className="member-info">
            <h3>{member.name}</h3>
            <p className="role">{member.role}</p>
            <p>{member.description}</p>
          </div>
        </div>
      ))}
    </div>

    );
    
}

export default AboutUs;
