import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Grid, TablePagination } from '@mui/material';
import { Link } from 'react-router-dom';
import { apiCallWithAuth } from 'utils/authAPI';
import ArticleCalendar from 'components/Calender';
import { format } from 'date-fns';
import axios from 'axios';

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cancelTokenSource, setCancelTokenSource] = useState(null);

  const fetchArticles = async (page, rowsPerPage) => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Operation canceled due to new request.');
    }
    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const url = `/api/articles/?date=${formattedDate}&page=${page + 1}&page_size=${rowsPerPage}`;
      const result = await apiCallWithAuth(url, 'GET', null, source.token);

      if (result.success) {
        const data = result.data;
        setArticles(data.results);
        setTotalPages(Math.ceil(data.count / rowsPerPage));
      } else {
        setError(result.errors);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        // Handle request cancellation
        setError({ error: 'Request Cancelled' });
      } else {
        setError({ error: 'Something went wrong' });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(page, rowsPerPage);
    // Clean up function to cancel ongoing requests on component unmount
    return () => {
      if (cancelTokenSource) {
        cancelTokenSource.cancel('Component unmounted');
      }
    };
  }, [selectedDate, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setPage(0);
    setArticles([]);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom>
        News
      </Typography>
      <ArticleCalendar onDateChange={handleDateChange} />

      {loading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : error ? (
        <Typography variant="body1" color="error">
          Error: {error.error || 'An unexpected error occurred'}
        </Typography>
      ) : (
        <>
          <TablePagination
            component="div"
            count={totalPages * rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{ marginBottom: 20, marginLeft: 0 }}
            sx={{
              display: 'flex',
              justifyContent: 'flex-start'
            }}
          />

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
        </>
      )}
    </Container>
  );
}

export default Dashboard;
