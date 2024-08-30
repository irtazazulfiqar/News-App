import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Grid, TablePagination } from '@mui/material';
import { Link } from 'react-router-dom';
import { apiCallWithAuth } from 'utils/authAPI';
import ArticleCalendar from 'components/Calender';
import { format } from 'date-fns';

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);  // MUI pagination starts from 0
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);  // Default page size
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to current date

  const fetchArticles = async (page, rowsPerPage) => {
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const url = `/api/articles/?date=${formattedDate}&page=${page + 1}&page_size=${rowsPerPage}`;
      const result = await apiCallWithAuth(url);

      if (result.success) {
        const data = result.data;
        setArticles(data.results);
        setTotalPages(Math.ceil(data.count / rowsPerPage)); // Calculate total pages based on the count and page size
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
    fetchArticles(page, rowsPerPage);
  }, [selectedDate, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage); // Update the page state, triggering a new API call
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Update the rows per page
    setPage(0); // Reset to page 0 when the page size changes
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setPage(0); // Reset to page 0 when the date changes
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
