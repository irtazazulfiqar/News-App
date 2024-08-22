import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, Box } from '@mui/material';

function ArticleDetails() {
  const location = useLocation();
  const { article } = location.state || {}; // Get article from state

  if (!article) {
    return <Typography variant="body1" color="error">Article not found</Typography>;
  }

  return (
    <Container style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
      <Card style={{ margin: '0 auto', maxWidth: '800px' }}>
        {article.image_link && (
          <CardMedia
            component="img"
            height="400" // Increase height for larger image
            image={article.image_link}
            alt={article.post_title}
            style={{ width: '100%', objectFit: 'cover' }}
          />
        )}
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {article.post_title}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            <strong>Author:</strong> {article.author_name}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            <strong>Published Date:</strong> {new Date(article.published_date).toLocaleDateString()}
          </Typography>
          <Box
            sx={{
              maxWidth: '600px', // Restrict width of the paragraph box
              margin: '0 auto', // Center the paragraph box
              padding: '2rem', // Add padding inside the paragraph box
              overflow: 'hidden', // Hide any overflow content
            }}
          >
            {article.content_paragraphs && article.content_paragraphs.length > 0 ? (
              article.content_paragraphs.map((paragraph, index) => (
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
