import React from 'react';
import '../styles/Learn.css';

function Learn() {
    const resources = [
        // Algorithmic Trading
        { title: 'What is Algorithmic Trading?', link: 'https://www.investopedia.com/terms/a/algorithmictrading.asp', category: 'Algorithmic Trading' },
        { title: 'Introduction to Algorithmic Trading', link: 'https://www.investopedia.com/articles/active-trading/101014/basics-algorithmic-trading-concepts-and-examples.asp', category: 'Algorithmic Trading' },
        { title: 'Algorithmic Trading Courses on Udemy', link: 'https://www.udemy.com/topic/algorithmic-trading/', category: 'Algorithmic Trading' },
        { title: 'Algorithmic Trading Courses on Coursera', link: 'https://www.coursera.org/courses?query=algorithmic%20trading', category: 'Algorithmic Trading' },
        { title: 'Algorithmic Trading Strategies', link: 'https://algotrading101.com/learn/', category: 'Algorithmic Trading' },
        { title: 'Algorithmic Trading Books', link: 'https://www.goodreads.com/search?q=algorithmic+trading&qid=gbWQHcmV1i', category: 'Algorithmic Trading' },
        
        // Mathematics
        { title: 'Mathematics for Trading', link: 'https://www.quantstart.com/articles/topic/mathematics-and-statistics/', category: 'Mathematics' },
        { title: 'Probability and Statistics for Trading', link: 'https://www.khanacademy.org/math/statistics-probability', category: 'Mathematics' },
        { title: 'Linear Algebra for Machine Learning', link: 'https://www.khanacademy.org/math/linear-algebra', category: 'Mathematics' },
        { title: 'Calculus for Finance', link: 'https://www.khanacademy.org/math/calculus-1', category: 'Mathematics' },
        { title: 'Mathematical Finance Journals', link: 'https://www.journals.elsevier.com/mathematics-and-financial-economics', category: 'Mathematics' },

        // Machine Learning
        { title: 'Machine Learning Crash Course', link: 'https://developers.google.com/machine-learning/crash-course', category: 'Machine Learning' },
        { title: 'Introduction to Neural Networks', link: 'https://www.youtube.com/watch?v=aircAruvnKk', category: 'Machine Learning' },
        { title: 'Machine Learning for Trading', link: 'https://www.udacity.com/course/machine-learning-for-trading--ud501', category: 'Machine Learning' },
        { title: 'Deep Learning Specialization', link: 'https://www.coursera.org/specializations/deep-learning', category: 'Machine Learning' },
        { title: 'Reinforcement Learning', link: 'https://www.coursera.org/search?query=reinforcement%20learning', category: 'Machine Learning' },

        // Finance
        { title: 'Finance Basics', link: 'https://www.investopedia.com/financial-term-dictionary-4769738', category: 'Finance' },
        { title: 'Financial Markets and Institutions', link: 'https://www.khanacademy.org/economics-finance-domain/core-finance', category: 'Finance' },
        { title: 'Corporate Finance', link: 'https://www.youtube.com/@CFI_Official', category: 'Finance' },
        { title: 'Financial Modeling', link: 'https://corporatefinanceinstitute.com/resources/knowledge/modeling/financial-modeling/', category: 'Finance' },
        { title: 'Finance Books for Beginners', link: 'https://www.google.com/search?q=best+books+to+learn+quantitative+finance&rlz=1C1OPNX_enUS1029US1029&oq=books+to+learn+quantiat&gs_lcrp=EgZjaHJvbWUqCAgBEAAYFhgeMgYIABBFGDkyCAgBEAAYFhgeMggIAhAAGBYYHjIICAMQABgWGB4yDQgEEAAYhgMYgAQYigUyDQgFEAAYhgMYgAQYigUyDQgGEAAYhgMYgAQYigUyDQgHEAAYhgMYgAQYigXSAQg0MTAzajBqNKgCALACAQ&sourceid=chrome&ie=UTF-8', category: 'Finance' },
    ];

    const categories = [...new Set(resources.map(resource => resource.category))];

    return (
        <div className="learn-container">
            <h1>Learn About Algorithmic Trading</h1>
            {categories.map(category => (
                <div key={category} className="category-section">
                    <h2>{category}</h2>
                    <div className="resources">
                        {resources.filter(resource => resource.category === category).map((resource, index) => (
                            <div key={index} className="resource-card">
                                <a href={resource.link} target="_blank" rel="noopener noreferrer">{resource.title}</a>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Learn;
