import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box,
  Card,
  CardContent,
  Button,
  Rating,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  Dialog,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { formatPrice } from '../utils/currency';

// Custom TabPanel component
const TabPanel = ({ children, value, index }) => {
  return value === index ? (
    <Box sx={{ p: 3 }}>
      {children}
    </Box>
  ) : null;
};

const ProductDetails = () => {
  const [zoomedImgIdx, setZoomedImgIdx] = useState(null);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const { addToCart } = useCart();

  // Keyboard navigation for zoomed images
  useEffect(() => {
    if (location.state) {
      setProduct(location.state);
    } else {
      // No product in state, redirect to home
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (zoomedImgIdx === null) return;
    const handleKeyDown = (e) => {
      if (!Array.isArray(product?.images) || product.images.length < 2) return;
      if (e.key === 'ArrowLeft') {
        setZoomedImgIdx(idx => (idx - 1 + product.images.length) % product.images.length);
      } else if (e.key === 'ArrowRight') {
        setZoomedImgIdx(idx => (idx + 1) % product.images.length);
      } else if (e.key === 'Escape') {
        setZoomedImgIdx(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomedImgIdx, product]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddToCart = () => {
    try {
      if (!product) return;
      // Ensure we have a price property
      const productToAdd = {
        ...product,
        price: product.price || product.specs?.price || 0,
        id: product.id || Date.now().toString() // Ensure we have a unique ID
      };
      addToCart(productToAdd);
      toast.success('Product added to cart successfully!');
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading product details...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" onClick={() => navigate('/')}>
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate(`/products?category=${product.category}`)}
        >
          {product.category}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Card>
            <Box sx={{ display: 'flex', flexDirection: 'row', overflowX: 'auto', gap: 2, background: '#fafafa', borderRadius: 2, p: 2, mb: 2 }}>
              {product.images && product.images.map((img, index) => (
  <img
    key={index}
    src={img}
    alt={product.name}
    style={{ width: 180, height: 140, objectFit: 'contain', borderRadius: 8, background: '#fff', boxShadow: '0 2px 8px #0001', cursor: 'pointer' }}
    onClick={() => setZoomedImgIdx(index)}
  />
))}
<Dialog open={zoomedImgIdx !== null} onClose={() => setZoomedImgIdx(null)} maxWidth="md" PaperProps={{ sx: { background: 'transparent', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' } }}>
  <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <IconButton
      onClick={() => setZoomedImgIdx(null)}
      sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', zIndex: 2, background: '#0008', '&:hover': { background: '#000c' } }}
    >
      <CloseIcon />
    </IconButton>
    {product.images && product.images.length > 1 && (
      <IconButton
        onClick={() => setZoomedImgIdx((zoomedImgIdx - 1 + product.images.length) % product.images.length)}
        sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#fff', zIndex: 2, background: '#0008', '&:hover': { background: '#000c' }, display: { xs: 'flex', md: 'flex' } }}
        aria-label="Previous image"
      >
        <ArrowBackIosNewIcon />
      </IconButton>
    )}
    <img
      src={product.images && product.images[zoomedImgIdx]}
      alt="Zoomed"
      style={{ maxWidth: '80vw', maxHeight: '80vh', borderRadius: 12, boxShadow: '0 6px 32px #0008', background: '#fff' }}
    />
    {product.images && product.images.length > 1 && (
      <IconButton
        onClick={() => setZoomedImgIdx((zoomedImgIdx + 1) % product.images.length)}
        sx={{ position: 'absolute', right: 48, top: '50%', transform: 'translateY(-50%)', color: '#fff', zIndex: 2, background: '#0008', '&:hover': { background: '#000c' }, display: { xs: 'flex', md: 'flex' } }}
        aria-label="Next image"
      >
        <ArrowForwardIosIcon />
      </IconButton>
    )}
  </Box>
</Dialog>
            </Box>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                {formatPrice(product.price)}
              </Typography>
              <Rating value={product.rating} readOnly precision={0.5} />
              
              <Typography variant="subtitle1" gutterBottom>
                <strong>Brand:</strong> {product.brand}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Model:</strong> {product.model}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                sx={{ mt: 2 }}
              >
                Add to Cart
              </Button>

              {/* Product Tabs */}
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mt: 2 }}>
                <Tab label="Description" />
                <Tab label="Specifications" />
                <Tab label="Additional Info" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {product.description}
                </Typography>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <List>
                  <Typography variant="h6" sx={{ mt: 2 }}>Technical Specifications</Typography>
                  {Object.entries(product.specs || {}).map(([key, value]) => (
                    <ListItem key={key}>
                      <ListItemText
                        primary={key.charAt(0).toUpperCase() + key.slice(1)}
                        secondary={typeof value === 'object' ? JSON.stringify(value) : value}
                      />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <List>
                  <Typography variant="h6" sx={{ mt: 2 }}>Additional Information</Typography>
                  <ListItem>
                    <ListItemText
                      primary="Category"
                      secondary={product.category}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="SKU"
                      secondary={`SKU-${product.id}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Brand"
                      secondary={product.brand}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Model"
                      secondary={product.model}
                    />
                  </ListItem>
                </List>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails;
