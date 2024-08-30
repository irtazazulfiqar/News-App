import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Grid, Pagination, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { apiCallWithAuth } from 'utils/authAPI';
import ArticleCalendar from 'components/Calender';
import { format } from 'date-fns';

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to current date
  const [pageSize, setPageSize] = useState(10); // Default page size

  const fetchArticles = async (url) => {
    try {
      const result = await apiCallWithAuth(url);

      if (result.success) {
        const data = result.data;
        setArticles(data.results);
        setTotalPages(Math.ceil(data.count / pageSize)); // Calculate total pages based on the count and page size
      } else {
        setError(result.errors);
      }
    } catch (error) {
      setError({ error: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd'); // Format the date
    const initialUrl = `/api/articles/?date=${formattedDate}&page=${page}&page_size=${pageSize}`;
    // Fetch articles when the component mounts and when `page`, `selectedDate`, or `pageSize` changes
    fetchArticles(initialUrl);
  }, [selectedDate, page, pageSize]);

  const handlePageChange = (event, value) => {
    setPage(value); // Update the page state, triggering a new API call
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setPage(1); // Reset to page 1 when the date changes
    setArticles([]);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value)); // Update page size state
    setPage(1); // Reset to page 1 when page size changes
    setArticles([]);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom>
        Latest News
      </Typography>
      <ArticleCalendar onDateChange={handleDateChange} />
      <TextField
        label="Page Size"
        type="number"
        value={pageSize}
        onChange={handlePageSizeChange}
        inputProps={{ min: 1, max: 100 }}
        style={{ marginBottom: 20 }}
      />
      {loading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : error ? (
        <Typography variant="body1" color="error">
          Error: {error.error || 'An unexpected error occurred'}
        </Typography>
      ) : (
        <>
          {articles.length === 0 && !loading && (
            <Typography variant="body1">No articles available</Typography>
          )}
          <Grid container spacing={3}>
            {articles.map((article) => (
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
