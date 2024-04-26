import React, { useState, useEffect } from 'react';
import axios from "axios";
import "../styles/news.css";
import stocksList from './stocksList';
import newsicon from "../assets/newspaper.svg"
import NewsRow from './NewsRow';

const TOKEN = "cnd3ll1r01qr85dtaltgcnd3ll1r01qr85dtalu0";
const BASE_URL = "https://finnhub.io/api/v1/news";
const from  ="2024-02-02";
const to = "2024-04-10";

const News = ({ selectStock }) => {
    const [news, setNews] = useState([]);
    const [foundNews, setfoundNews] = useState(false);

    useEffect(() => {
        const fetchNewsForCompany = async (stock) => {
            const url = `https://finnhub.io/api/v1/company-news?symbol=${stock}&from=${from}&to=${to}&token=${TOKEN}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.slice(0,10);
        };

        const loadNews = async () => {
            try {
                // let allNews = [];
                const companyNews = await fetchNewsForCompany(selectStock);
                console.log(companyNews);
                // allNews.push(...companyNews);
                setNews(companyNews);
                setfoundNews(companyNews.length > 0);
            } catch (error) {
                console.error('Failed to fetch news:', error);
                setfoundNews(false);
            }
        };
        if(selectStock){
            loadNews();
        }

    }, [selectStock]);

    return (
        <div>
            {foundNews ? (
                <div className='news-container'>
                    <p className="news-title">
                        <img src={newsicon} alt="News Icon" className="news__icon" />
                        {selectStock}'s News
                    </p>
                    {news.map((article, index) => (
                        <NewsRow key={index} article={article} />
                    ))}
                </div>
            ) : (
                <p></p>
            )}
        </div>
    );
};

export default News;
