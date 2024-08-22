import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Grid, Pagination } from '@mui/material';
import { Link } from 'react-router-dom';
import { apiCallWithAuth } from '../utility/authApi';

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchArticles = async () => {
      const today = new Date().toISOString().split('T')[0];
      const articlesPerPage = 6;

      try {
        const result = await apiCallWithAuth(`/api/articles/?date=${today}&page=${page}&limit=${articlesPerPage}`);

        if (result.success) {
          console.log('API Result:', result);

          const updatedArticles = result.data.results.map(article => ({
            ...article,
            id: article.image_link,  // Use image link as unique id
            content_paragraphs: Array.isArray(article.content_paragraphs)
              ? article.content_paragraphs.map(paragraph => paragraph.replace(/"/g, '')) // Remove double quotes
              : [],
          }));

          console.log('Updated Articles:', updatedArticles);

          const validArticles = updatedArticles.filter(article => article.image_link && article.image_link !== 'No image');

          setArticles(validArticles);
          setTotalPages(Math.ceil(result.data.count / articlesPerPage));
        } else {
          console.error('API Error:', result.errors);
          setError(result.errors);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        setError({ error: 'Something went wrong' });
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom>
        Latest News For Today
      </Typography>
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
              <Grid item xs={12} sm={6} md={4} key={article.id}>
                <Link
                  to={`/articles/${encodeURIComponent(article.id)}`}
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
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            style={{ marginTop: 20 }}
          />
        </>
      )}
    </Container>
  );
}

export default Dashboard;
