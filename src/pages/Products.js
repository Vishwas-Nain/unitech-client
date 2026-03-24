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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  styled,
  useTheme,
  Fade,
  CircularProgress
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoryFromQuery = searchParams.get('category') || 'all';
  
  const [productsByCategory, setProductsByCategory] = useState({
    laptops: [],
    desktops: [],
    accessories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(categoryFromQuery);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [zoomImgIdx, setZoomImgIdx] = useState(null);
  const { addToCart } = useCart();
  const theme = useTheme();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/products');
        const products = response.data.products || [];
        
        // Group products by category
        const grouped = {
          laptops: products.filter(p => p.category === 'laptop'),
          desktops: products.filter(p => p.category === 'desktop'),
          accessories: products.filter(p => p.category === 'accessories')
        };
        
        setProductsByCategory(grouped);
        console.log('✅ Products fetched from API:', grouped);
      } catch (err) {
        console.error('❌ Failed to fetch products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get search term from URL parameters
  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
    if (search) {
      setSearchTerm(search);
    }
    if (category && category !== 'all') {
      setActiveCategory(category);
    }
  }, [location.search]);

  // Get all products from all categories
  const allProducts = React.useMemo(() => {
    return Object.values(productsByCategory).flat();
  }, [productsByCategory]);

  // Filter products based on category
  const filteredProducts = React.useMemo(() => {
    if (!productsByCategory) return [];
    return activeCategory !== 'all' 
      ? productsByCategory[activeCategory] || []
      : allProducts;
  }, [activeCategory, productsByCategory, allProducts]);

  // Filter by search term
  const searchFilteredProducts = React.useMemo(() => {
    if (!filteredProducts) return [];
    return filteredProducts.filter(product => 
      product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredProducts, searchTerm]);

  // Handle product details
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setOpenDetails(true);
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    addToCart(product);
  };

  // Handle image zoom
  const handleImageClick = (index) => {
    setZoomImgIdx(index);
  };

  // Keyboard navigation for zoom modal
  useEffect(() => {
    if (zoomImgIdx === null || !selectedProduct || !selectedProduct.images) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setZoomImgIdx((zoomImgIdx - 1 + selectedProduct.images.length) % selectedProduct.images.length);
      } else if (e.key === 'ArrowRight') {
        setZoomImgIdx((zoomImgIdx + 1) % selectedProduct.images.length);
      } else if (e.key === 'Escape') {
        setZoomImgIdx(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomImgIdx, selectedProduct]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Products
      </Typography>

      {/* Category Filter */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant={activeCategory === 'all' ? 'contained' : 'outlined'}
          onClick={() => setActiveCategory('all')}
          sx={{ mr: 2 }}
        >
          All Products
        </Button>
        <Button
          variant={activeCategory === 'laptops' ? 'contained' : 'outlined'}
          onClick={() => setActiveCategory('laptops')}
          sx={{ mr: 2 }}
        >
          Laptops
        </Button>
        <Button
          variant={activeCategory === 'desktops' ? 'contained' : 'outlined'}
          onClick={() => setActiveCategory('desktops')}
          sx={{ mr: 2 }}
        >
          Desktops
        </Button>
        <Button
          variant={activeCategory === 'accessories' ? 'contained' : 'outlined'}
          onClick={() => setActiveCategory('accessories')}
        >
          Accessories
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Products Grid */}
      {searchFilteredProducts.length > 0 ? (
        <Grid container spacing={3}>
          {searchFilteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <StyledCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.images?.[0] || '/images/placeholder.jpg'}
                  alt={product.name}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleProductClick(product)}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {product.description}
                  </Typography>
                  <Typography variant="h5" color="primary" gutterBottom>
                    {formatPrice(product.price)}
                  </Typography>
                  <Rating value={product.rating || 4} readOnly size="small" />
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleAddToCart(product)}
                      fullWidth
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <Typography variant="h6" color="text.secondary">
            No products found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Product Details Dialog */}
      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedProduct && (
          <>
            <DialogTitle>{selectedProduct.name}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  {selectedProduct.images && selectedProduct.images.length > 0 && (
                    <CardMedia
                      component="img"
                      height="300"
                      image={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" paragraph>
                    {selectedProduct.description}
                  </Typography>
                  <Typography variant="h5" color="primary" gutterBottom>
                    {formatPrice(selectedProduct.price)}
                  </Typography>
                  <Rating value={selectedProduct.rating || 4} readOnly />
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleAddToCart(selectedProduct)}
                      fullWidth
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDetails(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Image Zoom Modal */}
      {zoomImgIdx !== null && selectedProduct?.images && (
        <Dialog
          open={zoomImgIdx !== null}
          onClose={() => setZoomImgIdx(null)}
          maxWidth="lg"
          fullWidth
        >
          <DialogContent sx={{ p: 0, position: 'relative' }}>
            <IconButton
              onClick={() => setZoomImgIdx(null)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
                bgcolor: 'rgba(255,255,255,0.8)',
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
              <IconButton
                onClick={() => setZoomImgIdx((zoomImgIdx - 1 + selectedProduct.images.length) % selectedProduct.images.length)}
                sx={{ position: 'absolute', left: 8 }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <CardMedia
                component="img"
                image={selectedProduct.images[zoomImgIdx]}
                alt={`${selectedProduct.name} - Image ${zoomImgIdx + 1}`}
                sx={{ maxWidth: '100%', maxHeight: '70vh' }}
              />
              <IconButton
                onClick={() => setZoomImgIdx((zoomImgIdx + 1) % selectedProduct.images.length)}
                sx={{ position: 'absolute', right: 8 }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Container>
  );
};

export default Products;
