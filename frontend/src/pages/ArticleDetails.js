import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, Box } from '@mui/material';
import { apiCallWithAuth } from 'utils/authAPI';

function ArticleDetails() {
  const { post_title } = useParams();
  const [articleDetails, setArticleDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Flag to check if component is still mounted

    const fetchArticleDetails = async () => {
      try {
        const payload = { post_title: decodeURIComponent(post_title) };

        const result = await apiCallWithAuth('/api/article/details/', 'POST', payload);

        if (isMounted) { // Only update state if component is still mounted
          if (result.success) {
            result.data.content_paragraphs = result.data.content_paragraphs.filter(paragraph => paragraph.trim() !== '');
            setArticleDetails(result.data);
          } else {
            setError('Failed to fetch article details');
          }
        }
      } catch (error) {
            if (isMounted) {
              setError('An error occurred while fetching article details');
            }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (post_title) {
      fetchArticleDetails();
    } else {
      setLoading(false);
      setError('Article not found');
    }

    return () => {
      isMounted = false; // Clean up flag on unmount
    };
  }, []);

  if (loading) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="body1" color="error">{error}</Typography>;
  }

  if (!articleDetails) {
    return <Typography variant="body1" color="error">Article not found</Typography>;
  }

  return (
    <Container style={{ padding: '1rem' }}>
      <Card style={{ margin: '0 auto', maxWidth: '800px' }}>
        {articleDetails.image_link && (
          <CardMedia
            component="img"
            height="400"
            image={articleDetails.image_link}
            alt={articleDetails.post_title}
            style={{ width: '100%', objectFit: 'cover' }}
          />
        )}
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {articleDetails.post_title}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            <strong>Author:</strong> {articleDetails.author_name}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            <strong>Published Date:</strong> {new Date(articleDetails.published_date).toLocaleDateString()}
          </Typography>
          <Box
            sx={{
              maxWidth: '600px',
              margin: '0 auto',
              padding: '2rem',
              overflow: 'hidden',
            }}
          >
            {articleDetails.content_paragraphs.length > 0 ? (
              articleDetails.content_paragraphs.map((paragraph, index) => (
                <Typography
                  variant="body1"
                  paragraph
                  key={index}
                >
                  {paragraph}
                </Typography>
              ))
            ) : (
              <Typography variant="body1">No content available</Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ArticleDetails;
