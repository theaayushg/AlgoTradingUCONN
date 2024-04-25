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
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-summary-link">
                <h3>{article.headline}</h3>
                <h4 className="news__source">Source: {article.source}</h4>
                    <p>{truncatedSummary}</p>
                </a>
            </div>
        );
    }
}

export default NewsRow;