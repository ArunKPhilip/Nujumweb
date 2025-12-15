import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Fab,
  Snackbar,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Tune as TuneIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Mock marketplace data
const mockProducts = [
  {
    id: '1',
    title: 'Electric Wheelchair - Premium Model',
    category: 'Mobility Aids',
    price: 2500,
    condition: 'Excellent',
    description: 'Lightweight electric wheelchair with excellent battery life and comfortable seating.',
    imageUrl: null,
    seller: 'Mobility Solutions UAE',
    location: 'Dubai, UAE',
  },
  {
    id: '2',
    title: 'Communication Augmentative Device',
    category: 'Communication',
    price: 1200,
    condition: 'Good',
    description: 'Speech-generating device with multiple language support and custom voice options.',
    imageUrl: null,
    seller: 'Assistive Tech Center',
    location: 'Abu Dhabi, UAE',
  },
  {
    id: '3',
    title: 'Adaptive Utensils Set',
    category: 'Daily Living',
    price: 85,
    condition: 'New',
    description: 'Complete set of adapted eating utensils with non-slip grips and proper angles.',
    imageUrl: null,
    seller: 'Wellness Store',
    location: 'Sharjah, UAE',
  },
  {
    id: '4',
    title: 'Height-Adjustable Standing Desk',
    category: 'Accessibility',
    price: 450,
    condition: 'New',
    description: 'Electric standing desk with programmable height settings and work surface.',
    imageUrl: null,
    seller: 'Office Solutions',
    location: 'Dubai, UAE',
  },
];

const categories = [
  'All',
  'Mobility Aids',
  'Daily Living',
  'Communication',
  'Medical Equipment',
  'Assistive Tech',
  'Therapy Tools',
  'Accessibility'
];

const MarketplacePage: React.FC = () => {
  const { state } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(mockProducts);
  const [createListingOpen, setCreateListingOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [productDetailsOpen, setProductDetailsOpen] = useState<{ open: boolean; product?: any }>({ open: false });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'success' });

  // Listing creation state
  const [newListing, setNewListing] = useState({
    title: '',
    price: '',
    description: '',
    category: 'Mobility Aids',
    condition: 'New',
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'newest':
      default:
        return 0; // Mock sort - in real app would use created dates
    }
  });

  const handleCreateListing = () => {
    // Create new listing
    const listing = {
      id: Date.now().toString(),
      title: newListing.title,
      category: newListing.category,
      price: parseFloat(newListing.price) || 0,
      condition: newListing.condition,
      description: newListing.description,
      imageUrl: null,
      seller: state.user?.username || 'Current User',
      location: 'Dubai, UAE', // Would get from user profile
    };

    // Add to products state
    setProducts(prev => [listing, ...prev]);

    // Reset form and close dialog
    setNewListing({ title: '', price: '', description: '', category: 'Mobility Aids', condition: 'New' });
    setCreateListingOpen(false);
    setSnackbar({ open: true, message: 'Listing created successfully!', severity: 'success' });
  };

  const handleSnackBarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderProductCard = (product: any) => (
    <Card
      sx={{
        maxWidth: 300,
        width: '100%',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={() => setProductDetailsOpen({ open: true, product })}
    >
      <Box sx={{
        height: 180,
        bgcolor: product.category === 'Mobility Aids' ? 'primary.main' :
                product.category === 'Communication' ? 'secondary.main' :
                product.category === 'Daily Living' ? 'success.main' : 'info.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px 12px 0 0',
      }}>
        <Typography variant="h3" color="white">
          {product.category === 'Mobility Aids' ? '♿' :
           product.category === 'Communication' ? '💬' :
           product.category === 'Daily Living' ? '🏠' : '🔧'}
        </Typography>
      </Box>

      <CardContent sx={{ flex: 1, p: 2 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
          {product.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.category}
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, maxHeight: 40, overflow: 'hidden' }}>
          {product.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            AED {product.price}
          </Typography>
          <Chip label={product.condition} size="small" color="primary" variant="outlined" />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            {product.seller}
          </Typography>
          <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {product.location}
          </Typography>
        </Box>

        <Button variant="contained" fullWidth size="small">
          {state.language === 'en' ? 'View Details' : 'عرض التفاصيل'}
        </Button>
      </CardContent>
    </Card>
  );

  const renderEmptyState = (icon: React.ElementType, title: string, message: string) => (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Box sx={{
        width: 120,
        height: 120,
        bgcolor: 'grey.100',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 'auto',
        mb: 3,
      }}>
        {React.createElement(icon, { sx: { fontSize: 48, color: 'grey.400' } })}
      </Box>
      <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
        {message}
      </Typography>
    </Box>
  );

  const renderMyListingCard = (product: any) => (
    <Card
      sx={{
        mb: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            {product.title}
          </Typography>
          <IconButton size="small">
            <TuneIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.category} • AED {product.price} • {product.condition}
        </Typography>

        <Button variant="outlined" size="small" sx={{ mr: 1 }}>
          {state.language === 'en' ? 'Edit' : 'تحرير'}
        </Button>
        <Button variant="outlined" size="small" color="error">
          {state.language === 'en' ? 'Delete' : 'حذف'}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight={600}>
            {state.language === 'en' ? 'Marketplace' : 'السوق'}
          </Typography>
          <IconButton onClick={() => setFilterDialogOpen(true)}>
            <TuneIcon />
          </IconButton>
        </Box>

        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={state.language === 'en' ? 'Browse' : 'التصفح'} />
          <Tab label={state.language === 'en' ? 'My Listings' : 'إعلاناتي'} />
        </Tabs>

        {selectedTab === 0 && (
          <Box>
            {/* Search and Category Filters */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <TextField
                  fullWidth
                  placeholder={state.language === 'en' ? 'Search items...' : 'البحث في العناصر...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    endAdornment: searchQuery && (
                      <IconButton onClick={() => setSearchQuery('')} size="small">
                        <span style={{ fontSize: '18px' }}>×</span>
                      </IconButton>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
                  {categories.map(category => (
                    <Chip
                      key={category}
                      label={category}
                      clickable
                      variant={selectedCategory === category ? 'filled' : 'outlined'}
                      color={selectedCategory === category ? 'primary' : 'default'}
                      onClick={() => setSelectedCategory(category)}
                      sx={{ flexShrink: 0 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Product Grid */}
            {sortedProducts.length > 0 ? (
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 3,
              }}>
                {sortedProducts.map(product => (
                  <Box key={product.id}>
                    {renderProductCard(product)}
                  </Box>
                ))}
              </Box>
            ) : (
              renderEmptyState(SearchIcon, 'No items found', 'Try adjusting your search')
            )}
          </Box>
        )}

        {selectedTab === 1 && (
          <Box>
            {selectedTab === 1 && filteredProducts.filter(p => p.seller === (state.user?.username || 'Current User')).length > 0 ? (
              filteredProducts.filter(p => p.seller === (state.user?.username || 'Current User')).map(product => renderMyListingCard(product))
            ) : (
              renderEmptyState(WorkIcon, 'No listings yet', 'Create your first listing')
            )}
          </Box>
        )}

        {/* Create Listing Dialog */}
        <Dialog open={createListingOpen} onClose={() => setCreateListingOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {state.language === 'en' ? 'Create New Listing' : 'إنشاء إعلان جديد'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label={state.language === 'en' ? 'Title' : 'العنوان'}
              value={newListing.title}
              onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
              sx={{ mb: 2, mt: 1 }}
            />

            <TextField
              fullWidth
              label={state.language === 'en' ? 'Price (AED)' : 'السعر (درهم)'}
              type="number"
              value={newListing.price}
              onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label={state.language === 'en' ? 'Description' : 'الوصف'}
              multiline
              rows={3}
              value={newListing.description}
              onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{state.language === 'en' ? 'Category' : 'الفئة'}</InputLabel>
              <Select
                value={newListing.category}
                onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                label={state.language === 'en' ? 'Category' : 'الفئة'}
              >
                {categories.slice(1).map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{state.language === 'en' ? 'Condition' : 'الحالة'}</InputLabel>
              <Select
                value={newListing.condition}
                onChange={(e) => setNewListing({ ...newListing, condition: e.target.value })}
                label={state.language === 'en' ? 'Condition' : 'الحالة'}
              >
                {['New', 'Like New', 'Good', 'Fair'].map(condition => (
                  <MenuItem key={condition} value={condition}>
                    {condition}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateListingOpen(false)}>
              {state.language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button variant="contained" onClick={handleCreateListing}>
              {state.language === 'en' ? 'Create Listing' : 'إنشاء الإعلان'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Filter Dialog */}
        <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {state.language === 'en' ? 'Filters' : 'التصفية'}
          </DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              {state.language === 'en' ? 'Category' : 'الفئة'}
            </Typography>
            <RadioGroup
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <FormControlLabel
                  key={category}
                  value={category}
                  control={<Radio />}
                  label={category}
                />
              ))}
            </RadioGroup>

            <Typography variant="subtitle1" sx={{ mb: 2, mt: 3, fontWeight: 600 }}>
              {state.language === 'en' ? 'Sort By' : 'الترتيب حسب'}
            </Typography>
            <RadioGroup
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <FormControlLabel value="newest" control={<Radio />} label="Newest" />
              <FormControlLabel value="price_low" control={<Radio />} label="Price Low to High" />
              <FormControlLabel value="price_high" control={<Radio />} label="Price High to Low" />
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setSelectedCategory('All');
              setSortBy('newest');
            }}>
              {state.language === 'en' ? 'Reset' : 'إعادة تعيين'}
            </Button>
            <Button variant="contained" onClick={() => setFilterDialogOpen(false)}>
              {state.language === 'en' ? 'Apply' : 'تطبيق'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Product Details Dialog */}
        <Dialog
          open={productDetailsOpen.open}
          onClose={() => setProductDetailsOpen({ open: false })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {state.language === 'en' ? 'Product Details' : 'تفاصيل المنتج'}
          </DialogTitle>
          <DialogContent>
            {productDetailsOpen.product && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {productDetailsOpen.product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {productDetailsOpen.product.category}
                </Typography>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }} color="primary.main">
                  AED {productDetailsOpen.product.price}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {state.language === 'en' ? 'Condition:' : 'الحالة:'} {productDetailsOpen.product.condition}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {state.language === 'en' ? 'Seller:' : 'البائع:'} {productDetailsOpen.product.seller}
                </Typography>
                <Typography variant="body2">
                  {state.language === 'en' ? 'Description:' : 'الوصف:'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {productDetailsOpen.product.description}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setProductDetailsOpen({ open: false })}>
              {state.language === 'en' ? 'Close' : 'إغلاق'}
            </Button>
            <Button variant="contained" onClick={() => {
              setProductDetailsOpen({ open: false });
              setSnackbar({ open: true, message: 'Contact request sent!', severity: 'success' });
            }}>
              {state.language === 'en' ? 'Contact Seller' : 'الاتصال بالبائع'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label={state.language === 'en' ? 'Create Listing' : 'إنشاء إعلان'}
          onClick={() => setCreateListingOpen(true)}
          sx={{
            position: 'fixed',
            bottom: { xs: 100, sm: 24 },
            right: 24,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackBarClose}>
          <Alert onClose={handleSnackBarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default MarketplacePage;
