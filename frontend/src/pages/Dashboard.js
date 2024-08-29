import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Grid, Pagination } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ArticleCalendar from 'components/Calender';
import { format } from 'date-fns';

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to current date

  useEffect(() => {
    const fetchArticles = async () => {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd'); // Format the date
      const articlesPerPage = 6;

      try {
        const { data } = await axios.get(`/api/articles/?date=${formattedDate}`);
        console.log(data);

        // Assuming a successful response has a "results" array
        if (data && data.results) {
          setPage(1); // Reset page to 1 when date changes
          setTotalPages(Math.ceil(data.results.length / articlesPerPage));

          setArticles(data.results);
          setDisplayedArticles(data.results.slice(0, articlesPerPage));
        } else {
          setError('Unexpected response structure');
        }
      } catch (err) {
        setError('Failed to fetch articles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedDate]);

  useEffect(() => {
    const articlesPerPage = 6;
    setDisplayedArticles(articles.slice((page - 1) * articlesPerPage, page * articlesPerPage));
  }, [page, articles]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date !== selectedDate){
    // Reset to page 1 when the date changes but only if selected-date and
    // current date are not equal
        setPage(1);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom>
        Latest News
      </Typography>
      <ArticleCalendar onDateChange={handleDateChange} />
      {loading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : error ? (
        <Typography variant="body1" color="error">
          Error: {error}
        </Typography>
      ) : (
        <>
          {displayedArticles.length === 0 && !loading && (
            <Typography variant="body1">No articles available</Typography>
          )}
          <Grid container spacing={3}>
            {displayedArticles.map((article) => (
              <Grid item xs={12} sm={6} md={4} key={article.post_title}>
                <Link
                  to={`/articles/${encodeURIComponent(article.post_title)}`}
                  state={{ article }}
                  style={{ textDecoration: 'none' }}
                >
                  <Card>
                    {article.image_link && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={article.image_link}
                        alt={article.post_title}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6">{article.post_title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {article.author_name} - {article.published_date}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              style={{ marginTop: 20 }}
            />
          )}
        </>
      )}
    </Container>
  );
}

export default Dashboard;
