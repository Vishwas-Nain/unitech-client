import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Fab,
  Skeleton,
  CircularProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  People as UsersIcon,
  Inventory as ProductsIcon,
  Category as CategoriesIcon,
  Analytics as AnalyticsIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { 
  getAdminDashboard, 
  getAdminUsers, 
  getAdminOrders,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  updateOrderStatus,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  toggleUserStatus
} from '../api/api';

const drawerWidth = 240;

// Skeleton Loading Components
const DashboardSkeleton = () => (
  <Grid container spacing={3}>
    {[1, 2, 3, 4].map((item) => (
      <Grid item xs={12} sm={6} md={3} key={item}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="rectangular" height={60} sx={{ my: 1 }} />
          </CardContent>
        </Card>
      </Grid>
    ))}
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Skeleton variant="text" width="20%" sx={{ mb: 2 }} />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3, 4, 5].map((item) => (
                  <TableRow key={item}>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={80} height={24} /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

const TableSkeleton = ({ rows = 5, columns = 6 }) => (
  <Card>
    <CardContent>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {Array(columns).fill(0).map((_, index) => (
                <TableCell key={index}>
                  <Skeleton variant="text" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array(rows).fill(0).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array(columns).fill(0).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getAdminDashboard();
      if (response.success) {
        setDashboardData(response);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAdminUsers();
      if (response.success) {
        setUsers(response.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAdminOrders();
      if (response.success) {
        setOrders(response.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products...');
      const response = await getAdminProducts();
      console.log('Products API response:', response);
      if (response.success) {
        console.log('Setting products:', response.products || []);
        setProducts(response.products || []);
      } else {
        console.error('Products API error:', response.error);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    
    // Only fetch data when needed (lazy loading)
    switch (section) {
      case 'users':
        if (users.length === 0) fetchUsers();
        break;
      case 'orders':
        if (orders.length === 0) fetchOrders();
        break;
      case 'products':
        if (products.length === 0) fetchProducts();
        break;
      case 'categories':
        if (products.length === 0) fetchProducts(); // Categories need products data
        break;
      default:
        if (!dashboardData) fetchDashboardData();
    }
  };

  const handleCreateProduct = async () => {
    try {
      const response = await createAdminProduct(editForm);
      console.log('Create product response:', response);
      if (response.success) {
        setDialogOpen(false);
        // Show success message
        alert('Product created successfully!');
        // Refresh products to show the new product in its category
        fetchProducts();
      } else {
        alert(response.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product. Please try again.');
    }
  };

  // User Management Handlers
  const handleCreateUser = async () => {
    try {
      const response = await createAdminUser(editForm);
      if (response.success) {
        setDialogOpen(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const { id, ...userData } = editForm;
      const response = await updateAdminUser(id, userData);
      if (response.success) {
        setDialogOpen(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await deleteAdminUser(userId);
        if (response.success) {
          fetchUsers();
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const response = await toggleUserStatus(userId);
      if (response.success) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await updateOrderStatus(orderId, { status });
      if (response.success) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Admin Panel
        </Typography>
      </Toolbar>
      <List>
        <ListItem 
          button 
          selected={selectedSection === 'dashboard'}
          onClick={() => handleSectionChange('dashboard')}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem 
          button 
          selected={selectedSection === 'products'}
          onClick={() => handleSectionChange('products')}
        >
          <ListItemIcon>
            <ProductsIcon />
          </ListItemIcon>
          <ListItemText primary="Products" />
        </ListItem>
        <ListItem 
          button 
          selected={selectedSection === 'orders'}
          onClick={() => handleSectionChange('orders')}
        >
          <ListItemIcon>
            <OrdersIcon />
          </ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItem>
        <ListItem 
          button 
          selected={selectedSection === 'users'}
          onClick={() => handleSectionChange('users')}
        >
          <ListItemIcon>
            <UsersIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem 
          button 
          selected={selectedSection === 'categories'}
          onClick={() => handleSectionChange('categories')}
        >
          <ListItemIcon>
            <CategoriesIcon />
          </ListItemIcon>
          <ListItemText primary="Categories" />
        </ListItem>
        <ListItem 
          button 
          selected={selectedSection === 'analytics'}
          onClick={() => handleSectionChange('analytics')}
        >
          <ListItemIcon>
            <AnalyticsIcon />
          </ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItem>
      </List>
    </div>
  );

  const renderDashboard = () => {
    if (loading && !dashboardData) {
      return <DashboardSkeleton />;
    }
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4">
                {dashboardData?.stats?.totalUsers || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4">
                {dashboardData?.stats?.totalOrders || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Products
              </Typography>
              <Typography variant="h4">
                {dashboardData?.stats?.totalProducts || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4">
                ${dashboardData?.stats?.totalRevenue || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData?.recentOrders?.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>{order._id.slice(-8)}</TableCell>
                        <TableCell>{order.user?.name || 'N/A'}</TableCell>
                        <TableCell>{order.user?.email || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status || 'Pending'} 
                            color="primary" 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>${order.totalAmount || 0}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderProducts = () => {
    if (loading && products.length === 0) {
      return <TableSkeleton rows={5} columns={6} />;
    }
    
    console.log('=== PRODUCT DEBUGGING ===');
    console.log('Current products:', products);
    console.log('Products length:', products.length);
    
    // Group products by category
    const groupedProducts = products.reduce((acc, product) => {
      const category = product.category || 'uncategorized';
      console.log(`Processing product: ${product.name}, category: ${category}`);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
    
    console.log('Grouped products:', groupedProducts);
    console.log('Available categories:', Object.keys(groupedProducts));
    
    // Check specifically for laptop category
    if (groupedProducts['laptop']) {
      console.log('Laptop products found:', groupedProducts['laptop']);
    } else {
      console.log('No laptop products found');
    }
    console.log('=== END DEBUGGING ===');

    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Product Management</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<RefreshIcon />}
              onClick={() => {
                console.log('Manual refresh triggered');
                fetchProducts();
              }}
            >
              Refresh Products
            </Button>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => {
                setDialogType('product');
                setEditForm({ name: '', price: '', category: 'laptop', brand: '', stock: '', description: '' });
                setDialogOpen(true);
              }}
            >
              Add Product
            </Button>
          </Box>
        </Box>
        
        {/* Show all products table first */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              All Products ({products.length})
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id || product._id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.brand || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={product.category || 'N/A'} 
                          color="primary" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Chip 
                          label={product.stock > 0 ? 'In Stock' : 'Out of Stock'} 
                          color={product.stock > 0 ? 'success' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        
        {/* Category Sections */}
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
          <Card key={category} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ textTransform: 'capitalize', flexGrow: 1 }}>
                  {category === 'laptop' && '💻'} {category === 'desktop' && '🖥️'} {category === 'accessories' && '🎧'} {category} ({categoryProducts.length})
                </Typography>
                <Chip 
                  label={categoryProducts.length} 
                  color="primary" 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              </Box>
              {categoryProducts.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Brand</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categoryProducts.map((product) => (
                        <TableRow key={product.id || product._id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.brand || 'N/A'}</TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <Chip 
                              label={product.stock > 0 ? 'In Stock' : 'Out of Stock'} 
                              color={product.stock > 0 ? 'success' : 'error'} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small">
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No products found in {category} category.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    sx={{ mt: 2 }}
                    onClick={() => {
                      setDialogType('product');
                      setEditForm({ name: '', price: '', category: category, brand: '', stock: '', description: '' });
                      setDialogOpen(true);
                    }}
                  >
                    Add First {category === 'laptop' && '💻'} {category === 'desktop' && '🖥️'} {category === 'accessories' && '🎧'} {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
        
        {/* Show all categories even if empty */}
        {['laptop', 'desktop', 'accessories'].filter(cat => !groupedProducts[cat]).map((category) => (
          <Card key={category} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ textTransform: 'capitalize', flexGrow: 1 }}>
                  {category === 'laptop' && '💻'} {category === 'desktop' && '🖥️'} {category === 'accessories' && '🎧'} {category} (0)
                </Typography>
                <Chip 
                  label={0} 
                  color="default" 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              </Box>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  No products found in {category} category.
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setDialogType('product');
                    setEditForm({ name: '', price: '', category: category, brand: '', stock: '', description: '' });
                    setDialogOpen(true);
                  }}
                >
                  Add First {category === 'laptop' && '💻'} {category === 'desktop' && '🖥️'} {category === 'accessories' && '🎧'} {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  const renderOrders = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order Management
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id.slice(-8)}</TableCell>
                  <TableCell>{order.user?.name || 'N/A'}</TableCell>
                  <TableCell>{order.user?.email || 'N/A'}</TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={order.status || 'pending'}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="processing">Processing</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>${order.totalAmount || 0}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <ViewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderUsers = () => {
    if (loading && users.length === 0) {
      return <TableSkeleton rows={5} columns={6} />;
    }
    
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">User Management</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => {
              setDialogType('user');
              setEditForm({ 
                name: '', 
                email: '', 
                mobile: '', 
                password: '', 
                role: 'user',
                is_verified: true 
              });
              setDialogOpen(true);
            }}
          >
            Add User
          </Button>
        </Box>
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Registered Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.mobile}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role || 'user'} 
                          color={user.role === 'admin' ? 'secondary' : 'primary'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.is_verified ? 'Active' : 'Inactive'} 
                          color={user.is_verified ? 'success' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => {
                            setDialogType('edit-user');
                            setEditForm({
                              id: user.id,
                              name: user.name,
                              email: user.email,
                              mobile: user.mobile,
                              role: user.role || 'user',
                              is_verified: user.is_verified
                            });
                            setDialogOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="warning"
                          onClick={() => handleToggleUserStatus(user.id)}
                          title={user.is_verified ? 'Deactivate User' : 'Activate User'}
                        >
                          {user.is_verified ? <BlockIcon /> : <CheckCircleIcon />}
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.role === 'admin'}
                          title="Delete User"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderCategories = () => {
    // Group products by category and calculate statistics
    const categoryStats = products.reduce((acc, product) => {
      const category = product.category || 'uncategorized';
      if (!acc[category]) {
        acc[category] = {
          name: category,
          count: 0,
          totalValue: 0,
          avgPrice: 0,
          products: []
        };
      }
      acc[category].count++;
      acc[category].totalValue += parseFloat(product.price || 0);
      acc[category].products.push(product);
      return acc;
    }, {});

    // Calculate average price for each category
    Object.keys(categoryStats).forEach(category => {
      categoryStats[category].avgPrice = categoryStats[category].totalValue / categoryStats[category].count;
    });

    const categories = Object.values(categoryStats);

    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Category Management</Typography>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />}
            onClick={() => {
              console.log('Refreshing categories...');
              fetchProducts();
            }}
          >
            Refresh
          </Button>
        </Box>

        {/* Category Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.name}>
              <Card sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ mr: 2, color: 'primary.main' }}>
                      {category.name === 'laptop' && '💻'}
                      {category.name === 'desktop' && '🖥️'}
                      {category.name === 'accessories' && '🎧'}
                      {category.name === 'uncategorized' && '📦'}
                    </Typography>
                    <Typography variant="h6" sx={{ textTransform: 'capitalize', flexGrow: 1 }}>
                      {category.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Products
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {category.count}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Average Price
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      ₹{Math.round(category.avgPrice).toLocaleString()}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Value
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      ₹{Math.round(category.totalValue).toLocaleString()}
                    </Typography>
                  </Box>

                  <Button 
                    variant="outlined" 
                    size="small" 
                    fullWidth
                    onClick={() => {
                      console.log(`Viewing ${category.name} category products`);
                      // You could navigate to products filtered by category
                    }}
                  >
                    View Products
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Category Details Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Category Details
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Products</TableCell>
                    <TableCell align="right">Average Price</TableCell>
                    <TableCell align="right">Total Value</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.name}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ mr: 1, fontSize: '1.2rem' }}>
                            {category.name === 'laptop' && '💻'}
                            {category.name === 'desktop' && '🖥️'}
                            {category.name === 'accessories' && '🎧'}
                            {category.name === 'uncategorized' && '📦'}
                          </Typography>
                          <Typography sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                            {category.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={category.count} 
                          color="primary" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        ₹{Math.round(category.avgPrice).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          ₹{Math.round(category.totalValue).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={category.count > 0 ? 'Active' : 'Empty'} 
                          color={category.count > 0 ? 'success' : 'default'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" sx={{ mr: 1 }}>
                          <ViewIcon />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Empty State */}
        {categories.length === 0 && (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Categories Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add some products to see category statistics here.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => setSelectedSection('products')}
              >
                Add Products
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
    );
  };

  const renderAnalytics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Sales Analytics
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Analytics charts and graphs coming soon...
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Selling Products
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Product analytics coming soon...
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return renderDashboard();
      case 'products':
        return renderProducts();
      case 'orders':
        return renderOrders();
      case 'users':
        return renderUsers();
      case 'categories':
        return renderCategories();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderDashboard();
    }
  };

  if (loading && !dashboardData) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          {renderContent()}
        </Container>
      </Box>

      {/* Add Product Dialog */}
      <Dialog open={dialogOpen && dialogType === 'product'} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Product Name"
            fullWidth
            variant="outlined"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            value={editForm.price}
            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              label="Category"
              required
            >
              <MenuItem value="laptop">💻 Laptop</MenuItem>
              <MenuItem value="desktop">🖥️ Desktop</MenuItem>
              <MenuItem value="accessories">🎧 Accessories</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Brand"
            fullWidth
            variant="outlined"
            value={editForm.brand || ''}
            onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Stock"
            type="number"
            fullWidth
            variant="outlined"
            value={editForm.stock}
            onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateProduct} variant="contained">Add Product</Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={dialogOpen && dialogType === 'user'} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Mobile"
            fullWidth
            variant="outlined"
            value={editForm.mobile}
            onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={editForm.password}
            onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              label="Role"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained">Add User</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={dialogOpen && dialogType === 'edit-user'} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Mobile"
            fullWidth
            variant="outlined"
            value={editForm.mobile}
            onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              label="Role"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={editForm.is_verified}
              onChange={(e) => setEditForm({ ...editForm, is_verified: e.target.value })}
              label="Status"
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateUser} variant="contained">Update User</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
