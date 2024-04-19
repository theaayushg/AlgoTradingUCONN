import React from 'react';
import '../styles/AboutUs.css'; // Make sure to create this CSS file in the same directory

function AboutUs() {
    const teamMembers = [
        { name: 'Aayush', role: 'CS Senior - Computational Data Analytics', description: 'Aayush was the Team Manager for this project and focused on the web development along with research for this project.', image: '../../src/styles/aayush.PNG' },
        { name: 'Long', role: 'CS Senior - Cyber Security', description: 'Long is a undergrad CS student who studies cybersecurity as his concentration. His focus on this project was on model building and web building.', image: '../../src/styles/long.PNG' },
        { name: 'Chenghe', role: 'CS Senior - Unspecialized', description: 'Chenghe is an undergraduate computer science student from Xian, China. Chenghe focused on data collection and various web development tasks.', image: '../../src/styles/chenghe.PNG' },
        { name: 'Ishan', role: 'CS Senior - Software Design Development', description: 'Ishan was in charge of leading the frontend for this project as well as connecting the UI to the backend.', image: '../../src/styles/ishan.PNG' },
        { name: 'Sunwang', role: 'CS Senior - Computational Data Analytics', description: 'Majoring in Computer Science with a concentration of Computational Data Analytics. I focused on design, train, and tune machine learning model for the project.', image: '../../src/styles/sunwang.PNG' },
        { name: 'Ron', role: 'CS Senior - Unspecialized', description: 'Ron was in charge of the data visualizations within the front end focusing on graphs and overall design for the website.', image: '../../src/styles/ron.PNG' },
        { name: 'Siddharth', role: 'CS Senior - Computational Data Analytics', description: 'Siddharth is a computer science and engineering major with a concentration in computational data analytics. He is in charge of transaction display.', image: '../../src/styles/siddharth.jpg' },
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
