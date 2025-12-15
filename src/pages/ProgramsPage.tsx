import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Snackbar,
  Alert,
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Launch as LaunchIcon,
  CheckCircle as CheckCircleIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  BookmarkBorder as BookmarkIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Mock programs data
const governmentPrograms = [
  {
    id: '1',
    title: 'Assistive Technology Subsidy Program',
    category: 'Technology',
    description: 'Government subsidy for essential assistive devices including wheelchairs, hearing aids, and communication devices.',
    eligibility: ['UAE citizens and residents', 'Diagnosed disability requiring assistive technology', 'Income below AED 60,000 annually'],
    benefits: ['Up to 80% subsidy on device cost', 'Maintenance service coverage', 'Technical support included'],
    applicationUrl: 'https://dubaipersonwithdisability.ae',
    deadline: '2025-12-31',
    funding: 'Ministry of Community Development',
    amount: 'Up to AED 25,000',
    isActive: true,
  },
  {
    id: '2',
    title: 'Housing Accessibility Grant',
    category: 'Housing',
    description: 'Financial assistance for home modifications to accommodate persons with disabilities.',
    eligibility: ['UAE residents', 'Maximum household income AED 30,000', 'No previous grants in 3 years'],
    benefits: ['Up to AED 50,000 grant', 'Ramp installation', 'Bathroom modifications', 'Kitchen adaptation'],
    applicationUrl: 'https://mohaphousing.ae',
    deadline: '2025-11-30',
    funding: 'Ministry of Housing',
    amount: 'Up to AED 50,000',
    isActive: true,
  },
  {
    id: '3',
    title: 'Education Support Fund',
    category: 'Education',
    description: 'Fund for special education, tutoring, and educational materials for students with disabilities.',
    eligibility: ['UAE students aged 4-18', 'Enrolled in accredited educational institution', 'Diagnosed learning disability'],
    benefits: ['Special education classes', 'Educational materials', 'Transportation assistance', '24/7 tutoring support'],
    applicationUrl: 'https://edu.ae/disability-support',
    deadline: '2026-06-30',
    funding: 'Ministry of Education',
    amount: 'Ongoing monthly support',
    isActive: true,
  },
  {
    id: '4',
    title: 'Employment Support Program',
    category: 'Employment',
    description: 'Vocational training and job placement assistance for persons with disabilities.',
    eligibility: ['UAE residents aged 18+', 'Unemployed', 'Ability to participate in training'],
    benefits: ['Vocational training', 'Job placement services', 'Workplace modifications', 'Transportation subsidy'],
    applicationUrl: 'https://mohap.ae/employment',
    deadline: 'Ongoing',
    funding: 'Ministry of Human Resources',
    amount: 'Varies by program',
    isActive: true,
  },
];

const privatePrograms = [
  {
    id: '5',
    title: 'Dubai Future Foundation Disability Scholarships',
    category: 'Education',
    description: 'Full scholarship program for university education for bright students with disabilities.',
    eligibility: ['UAE citizens', 'High school graduates', 'GPA 3.5+ minimum', 'Demonstrated leadership'],
    benefits: ['Full tuition coverage', 'Living allowance', 'Internship opportunities', 'Mentorship program'],
    applicationUrl: 'https://dubai-future-foundation.org/scholarships',
    deadline: '2025-03-15',
    funding: 'Dubai Future Foundation',
    amount: 'AED 200,000 annually',
    isActive: true,
  },
  {
    id: '6',
    title: 'Emirates Insurance TG Group Health Coverage',
    category: 'Healthcare',
    description: 'Specialized health insurance package for persons with disabilities.',
    eligibility: ['UAE residents', 'Valid disability certificate', 'Coverage for family dependents'],
    benefits: ['0% co-payment on disability-related procedures', 'Unlimited therapy sessions', 'Home care services', 'Medication coverage'],
    applicationUrl: 'https://emirates.com/disability-insurance',
    deadline: 'Ongoing',
    funding: 'Emirates Insurance',
    amount: 'Custom premium pricing',
    isActive: true,
  },
  {
    id: '7',
    title: 'ADNOC Adaptive Sports Sponsorship',
    category: 'Sports',
    description: 'Sponsorship program for adaptive sports participation and training.',
    eligibility: ['UAE residents', 'Medical clearance for sports activity', 'Age 8-40 years'],
    benefits: ['Full equipment sponsorship', 'Professional coaching', 'Tournament participation', 'Transportation to events'],
    applicationUrl: 'https://adnoc.com/disability-sports',
    deadline: '2025-07-01',
    funding: 'ADNOC Sponsorship Division',
    amount: 'Up to AED 15,000 annually',
    isActive: true,
  },
  {
    id: '8',
    title: 'Emaar Community Housing Initiative',
    category: 'Housing',
    description: 'Affordable and accessible housing units for families with disability.',
    eligibility: ['UAE residents', 'Household income < AED 40,000', 'Priority for families with children'],
    benefits: ['Subsidized housing units', 'Fully accessible features', 'Community support', 'Maintenance assistance'],
    applicationUrl: 'https://emaar.com/community-housing',
    deadline: 'Vacancies open',
    funding: 'Emaar Properties PJSC',
    amount: '30% housing subsidy',
    isActive: true,
  },
];

const marketplaceVouchers = [
  {
    id: '9',
    title: 'Assistive Technology Voucher Program',
    category: 'Technology',
    description: 'Direct vouchers redeemable at certified assistive technology retailers.',
    eligibility: ['Valid disability certificate', 'First-time voucher recipient', 'Purchase through approved vendors'],
    benefits: ['AED 10,000 voucher', 'Redeemable anywhere', 'No expiration date', '24/7 support line'],
    applicationUrl: 'https://assisttech.ae/voucher-program',
    deadline: 'Ongoing',
    funding: 'Assistive Technology Coalition',
    amount: 'AED 10,000',
    isActive: true,
  },
];

const categories = ['All', 'Technology', 'Education', 'Healthcare', 'Housing', 'Employment', 'Sports'];

const ProgramsPage: React.FC = () => {
  const { state } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'success' });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const getAllPrograms = () => [
    ...governmentPrograms,
    ...privatePrograms,
    ...marketplaceVouchers,
  ];

  const getFilteredPrograms = () => {
    let programs = getAllPrograms();

    // Apply tab filter
    if (selectedTab === 1) programs = programs.filter(p => governmentPrograms.some(g => g.id === p.id));
    if (selectedTab === 2) programs = programs.filter(p => privatePrograms.some(g => g.id === p.id));
    if (selectedTab === 3) programs = programs.filter(p => marketplaceVouchers.some(g => g.id === p.id));

    // Apply category filter
    if (selectedCategory !== 'All') {
      programs = programs.filter(p => p.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      programs = programs.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    return programs;
  };

  const toggleFavorite = (programId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(programId)) {
        newFavorites.delete(programId);
      } else {
        newFavorites.add(programId);
      }
      return newFavorites;
    });
  };

  const handleApply = (program: any) => {
    setSelectedProgram(program);
    setApplyDialogOpen(true);
  };

  const handleSnackBarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderProgramCard = (program: any) => (
    <Card
      sx={{
        mb: 3,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        position: 'relative',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with favorite button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              {program.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
              <Chip
                label={program.category}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={program.isActive ?
                  (state.language === 'en' ? 'Active' : 'نشط') :
                  (state.language === 'en' ? 'Inactive' : 'غير نشط')
                }
                size="small"
                color="success"
                variant="filled"
              />
            </Box>
          </Box>
          <IconButton
            onClick={() => toggleFavorite(program.id)}
            sx={{
              color: favorites.has(program.id) ? 'error.main' : 'grey.400',
              '&:hover': { color: 'error.main' },
            }}
          >
            {favorites.has(program.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {program.description}
        </Typography>

        {/* Funding and amount */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {state.language === 'en' ? 'Funded by:' : 'ممول من:'} {program.funding}
          </Typography>
          <Chip
            label={program.amount}
            size="small"
            color="secondary"
            variant="filled"
          />
        </Box>

        {/* Eligibility checklist */}
        <Box sx={{ mb: 2 }}>
          <Accordion elevation={0} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2" fontWeight={600}>
                {state.language === 'en' ? 'Eligibility Criteria' : 'معايير الأهلية'}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {program.eligibility.map((item: string, index: number) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main', mr: 1 }} />
                  <Typography variant="body2">{item}</Typography>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Benefits */}
        <Box sx={{ mb: 2 }}>
          <Accordion elevation={0} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2" fontWeight={600}>
                {state.language === 'en' ? 'Benefits' : 'المزايا'}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {program.benefits.map((benefit: string, index: number) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: 'primary.main', mr: 1 }} />
                  <Typography variant="body2">{benefit}</Typography>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Application info */}
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {state.language === 'en' ? 'Deadline:' : 'الموعد النهائي:'} {program.deadline}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {state.language === 'en' ? 'Application:' : 'التقديم:'} {program.applicationUrl}
          </Typography>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleApply(program)}
          >
            {state.language === 'en' ? 'Apply Now' : 'تقدم الآن'}
          </Button>
          <Button
            variant="outlined"
            component="a"
            href={program.applicationUrl}
            target="_blank"
            startIcon={<LaunchIcon />}
            sx={{ minWidth: 'auto' }}
          >
            {state.language === 'en' ? 'Visit' : 'زيارة'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderCategoryChip = (category: string) => (
    <Chip
      key={category}
      label={category}
      clickable
      variant={selectedCategory === category ? 'filled' : 'outlined'}
      color={selectedCategory === category ? 'primary' : 'default'}
      onClick={() => setSelectedCategory(category)}
    />
  );

  const filteredPrograms = getFilteredPrograms();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight={600}>
            {state.language === 'en' ? 'Programs & Benefits' : 'البرامج والمزايا'}
          </Typography>
          <IconButton onClick={() => setFilterDialogOpen(true)}>
            <FilterIcon />
          </IconButton>
        </Box>

        {/* Search */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder={state.language === 'en' ? 'Search programs and benefits...' : 'البحث عن البرامج والمزايا...'}
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
            />

            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {categories.map(renderCategoryChip)}
            </Box>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={state.language === 'en' ? 'All' : 'الكل'} />
          <Tab label={state.language === 'en' ? 'Government' : 'حكومي'} />
          <Tab label={state.language === 'en' ? 'Private' : 'خاص'} />
          <Tab label={state.language === 'en' ? 'Vouchers' : 'قسائم'} />
        </Tabs>

        {/* Results */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {filteredPrograms.length} {state.language === 'en' ? 'programs found' : 'برنامج تم العثور عليه'}
          </Typography>
        </Box>

        <Box>
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map(renderProgramCard)
          ) : (
            <Card sx={{ textAlign: 'center', py: 6 }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  {state.language === 'en' ? 'No programs match your criteria' : 'لا توجد برامج تطابق معاييرك'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {state.language === 'en' ? 'Try adjusting your search or filters' : 'جرب تعديل البحث أو المرشحات'}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Filter Dialog */}
        <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {state.language === 'en' ? 'Filter Programs' : 'تصفية البرامج'}
          </DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              {state.language === 'en' ? 'Category' : 'الفئة'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {categories.map(category => (
                <Box key={category} sx={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                    style={{ marginRight: 8 }}
                  />
                  <Typography variant="body1">
                    {category}
                  </Typography>
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}>
              {state.language === 'en' ? 'Reset' : 'إعادة تعيين'}
            </Button>
            <Button variant="contained" onClick={() => setFilterDialogOpen(false)}>
              {state.language === 'en' ? 'Apply' : 'تطبيق'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Apply Dialog */}
        <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} maxWidth="md">
          <DialogTitle>
            {state.language === 'en' ? 'Apply for Program' : 'التقدم للبرنامج'}
          </DialogTitle>
          <DialogContent>
            {selectedProgram && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {selectedProgram.title}
                </Typography>

                <TextField
                  fullWidth
                  label={state.language === 'en' ? 'Full Name' : 'الاسم الكامل'}
                  defaultValue={state.user?.fullName}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label={state.language === 'en' ? 'National ID' : 'رقم الهوية'}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label={state.language === 'en' ? 'Disability Type' : 'نوع الإعاقة'}
                  defaultValue={state.user?.disabilityType}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label={state.language === 'en' ? 'Monthly Income (AED)' : 'الدخل الشهري (درهم)'}
                  type="number"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label={state.language === 'en' ? 'Additional Notes' : 'ملاحظات إضافية'}
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />

                <Typography variant="body2" color="text.secondary">
                  {state.language === 'en'
                    ? 'By submitting this application, you agree to the terms and conditions of this program.'
                    : 'بتقديم هذا الطلب، توافق على الشروط والأحكام لهذا البرنامج.'
                  }
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApplyDialogOpen(false)}>
              {state.language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button variant="contained" onClick={() => {
              setApplyDialogOpen(false);
              setSnackbar({
                open: true,
                message: state.language === 'en' ? 'Application submitted successfully!' : 'تم تقديم الطلب بنجاح!',
                severity: 'success'
              });
            }}>
              {state.language === 'en' ? 'Submit Application' : 'إرسال الطلب'}
            </Button>
          </DialogActions>
        </Dialog>

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

export default ProgramsPage;
