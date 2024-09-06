import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Grid, TablePagination } from '@mui/material';
import { Link } from 'react-router-dom';
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

const fetchArticles = async (page, rowsPerPage) => {
  try {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const url = `/api/articles/?date=${formattedDate}&page=${page + 1}&page_size=${rowsPerPage}`;
    const result = await axios.get(url);

    const data = result.data;
    setArticles(data.results);
    setTotalPages(Math.ceil(data.count / rowsPerPage));
    setError(null);
  } catch (error) {
    if (error.response) {
      // Handle max request limit or other server errors
      if (error.response.status === 429) {
        setError('Something went wrong. Please try again later.');
      } else {
        setError(`Error: ${error.response.status} - ${error.response.data.detail || 'Something went wrong'}`);
      }
    } else {
      // Generic error for network issues or other failures
      setError('Something went wrong. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchArticles(page, rowsPerPage);
  }, [selectedDate, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);

    if (date !== selectedDate)
    {
        setPage(0);
    }
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
          Error: {error}
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
              <Grid item xs={12} sm={6} md={4} key={article._id}>
                <Link
                  to={`/articles/${encodeURIComponent(article._id)}`}
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
