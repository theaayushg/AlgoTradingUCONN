import React, { Component } from 'react';
import "../styles/news.css"

class NewsRow extends Component {
    truncateSummary(summary, maxWords = 45) {
        const words = summary.split(' ');
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return summary;
    }
    render() {
        const { article } = this.props;
        const truncatedSummary = this.truncateSummary(article.summary);
        return (
            <div className="news__article">
                <h3>{article.headline}</h3>
                <h3 className="news__source">Source: {article.source}</h3>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-summary-link">
                    <p>{truncatedSummary}</p>
                </a>
            </div>
        );
    }
}

export default NewsRow;