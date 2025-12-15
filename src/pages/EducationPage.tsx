import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
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
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Work as WorkIcon,
  School as SchoolIcon,
  Search as SearchIcon,
  Tune as TuneIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Mock job data
const mockJobs = [
  {
    id: '1',
    title: 'Web Accessibility Specialist',
    company: 'TechCare Solutions',
    location: 'Dubai, UAE',
    jobType: 'Full-time',
    salary: 'AED 15,000 - 20,000',
    description: 'Join our team to help make the web accessible for all users with disabilities. Experience with WCAG guidelines required.',
    category: 'Technology',
    createdAt: '2025-12-10T08:30:00Z',
  },
  {
    id: '2',
    title: 'Inclusive Education Coordinator',
    company: 'Inclusive Learning Center',
    location: 'Abu Dhabi, UAE',
    jobType: 'Part-time',
    salary: 'AED 12,000 - 15,000',
    description: 'Support the development and implementation of inclusive education programs for students with diverse needs.',
    category: 'Education',
    createdAt: '2025-12-08T14:20:00Z',
  },
  {
    id: '3',
    title: 'Assistive Technology Trainer',
    company: 'NUJJUM Foundation',
    location: 'Sharjah, UAE',
    jobType: 'Remote',
    salary: 'AED 14,000 - 18,000',
    description: 'Train users on assistive technologies and provide technical support for accessibility tools.',
    category: 'Technology',
    createdAt: '2025-12-06T11:15:00Z',
  },
];

const categories = [
  'All',
  'Technology',
  'Healthcare',
  'Education',
  'Customer Service',
  'Finance',
  'Marketing',
  'Administration'
];

const jobTypes = ['All', 'Full-time', 'Part-time', 'Remote', 'Freelance'];

const trainingPrograms = [
  {
    id: '1',
    title: 'Web Accessibility Certification',
    provider: 'Global Access Institute',
    duration: '6 weeks',
    type: 'Certification',
    level: 'Intermediate',
    description: 'Learn WCAG 2.1 guidelines and practical accessibility implementation.',
  },
  {
    id: '2',
    title: 'Inclusive Teaching Practices',
    provider: 'Education Excellence',
    duration: '8 weeks',
    type: 'Diploma',
    level: 'Advanced',
    description: 'Master inclusive education strategies and adaptive teaching methods.',
  },
];

const mockNotifications = [
  {
    id: 1,
    icon: WorkIcon,
    title: 'New job match',
    message: 'Accessible Web Developer at TechCare',
    time: '2 hours ago',
    color: 'success.main',
  },
  {
    id: 2,
    icon: TuneIcon,
    title: 'Application update',
    message: 'Your application is under review',
    time: '1 day ago',
    color: 'warning.main',
  },
  {
    id: 3,
    icon: SchoolIcon,
    title: 'Training reminder',
    message: 'Web Development Bootcamp starts in 3 days',
    time: '2 days ago',
    color: 'info.main',
  },
];

const EducationPage: React.FC = () => {
  const { state } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs] = useState(mockJobs);
  const [createAlertOpen, setCreateAlertOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [jobDetailsOpen, setJobDetailsOpen] = useState<{ open: boolean; job?: any }>({ open: false });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'success' });
  const [alertKeywords, setAlertKeywords] = useState('');
  const [alertCategory, setAlertCategory] = useState('All');

  // Simulate real-time data loading
  useEffect(() => {
    const interval = setInterval(() => {
      // Could fetch new jobs here
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesType = selectedJobType === 'All' || job.jobType === selectedJobType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleApplyForJob = (job: any) => {
    // Simulate job application
    setSnackbar({ open: true, message: 'Application submitted successfully!', severity: 'success' });
  };

  const handleCreateJobAlert = () => {
    setCreateAlertOpen(false);
    setSnackbar({ open: true, message: 'Job alert created successfully!', severity: 'success' });
    setAlertKeywords('');
    setAlertCategory('All');
  };

  const handleSnackBarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      const now = new Date();
      const difference = now.getTime() - date.getTime();
      const minutes = Math.floor(difference / (1000 * 60));
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));

      if (days > 0) {
        return `${days}d ago`;
      } else if (hours > 0) {
        return `${hours}h ago`;
      } else if (minutes > 0) {
        return `${minutes}m ago`;
      } else {
        return 'Just now';
      }
    } catch (e) {
      return dateTime;
    }
  };

  const renderJobCard = (job: any) => (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        '&:hover': { boxShadow: 3 },
        border: '1px solid',
        borderColor: 'divider',
      }}
      onClick={() => setJobDetailsOpen({ open: true, job })}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <WorkIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
              {job.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {job.company} • {job.location}
            </Typography>
          </Box>
          <Chip
            label={job.jobType}
            size="small"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 500,
            }}
          />
        </Box>

        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          {job.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {job.salary && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MoneyIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" fontWeight={500}>
                  {job.salary}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2">
                {formatTime(job.createdAt)}
              </Typography>
            </Box>
          </Box>
          <Button variant="contained" size="small" onClick={(e) => {
            e.stopPropagation();
            handleApplyForJob(job);
          }}>
            {state.language === 'en' ? 'Apply' : 'تقدم'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderTrainingCard = (training: any) => (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        '&:hover': { boxShadow: 3 },
        border: '1px solid',
        borderColor: 'divider',
      }}
      onClick={() => {
        // Show training details
        setSnackbar({ open: true, message: 'Training program details coming soon!', severity: 'info' });
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <SchoolIcon sx={{ color: 'success.main', mr: 2, mt: 0.5 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
              {training.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {training.provider} • {training.duration}
            </Typography>
            <Chip
              label={training.level}
              size="small"
              sx={{
                bgcolor: 'success.main',
                color: 'white',
                fontWeight: 500,
              }}
            />
          </Box>
        </Box>

        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          {training.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip label={training.type} variant="outlined" size="small" />
          <Button variant="outlined" size="small">
            {state.language === 'en' ? 'View Details' : 'عرض التفاصيل'}
          </Button>
        </Box>
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight={600}>
            {state.language === 'en' ? 'Jobs & Training' : 'الوظائف والتدريب'}
          </Typography>
          <IconButton onClick={() => setNotificationsOpen(true)}>
            <NotificationsIcon />
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
          <Tab label={state.language === 'en' ? 'Jobs' : 'الوظائف'} />
          <Tab label={state.language === 'en' ? 'Training' : 'التدريب'} />
        </Tabs>

        {selectedTab === 0 && (
          <Box>
            {/* Search and Filter Bar */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    placeholder={state.language === 'en' ? 'Search jobs...' : 'البحث عن وظائف...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                  <IconButton
                    onClick={() => setFilterDialogOpen(true)}
                    sx={{ bgcolor: 'action.hover', borderRadius: 1 }}
                  >
                    <TuneIcon />
                  </IconButton>
                </Box>

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

            {/* Jobs List */}
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => renderJobCard(job))
            ) : (
              renderEmptyState(WorkIcon, 'No jobs found', 'Try adjusting your filters')
            )}
          </Box>
        )}

        {selectedTab === 1 && (
          <Box>
            {trainingPrograms.length > 0 ? (
              trainingPrograms.map(training => renderTrainingCard(training))
            ) : (
              renderEmptyState(SchoolIcon, 'No training programs', 'Check back soon for new programs')
            )}
          </Box>
        )}

        {/* Job Details Dialog */}
        <Dialog
          open={jobDetailsOpen.open}
          onClose={() => setJobDetailsOpen({ open: false })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {state.language === 'en' ? 'Job Details' : 'تفاصيل الوظيفة'}
          </DialogTitle>
          <DialogContent>
            {jobDetailsOpen.job && (
              <Box sx={{ py: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {jobDetailsOpen.job.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {jobDetailsOpen.job.company} • {jobDetailsOpen.job.location}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {state.language === 'en' ? 'Job Type' : 'نوع الوظيفة'}: {jobDetailsOpen.job.jobType}
                </Typography>
                {jobDetailsOpen.job.salary && (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {state.language === 'en' ? 'Salary' : 'الراتب'}: {jobDetailsOpen.job.salary}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {state.language === 'en' ? 'Description' : 'الوصف'}:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {jobDetailsOpen.job.description}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setJobDetailsOpen({ open: false })}>
              {state.language === 'en' ? 'Close' : 'إغلاق'}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (jobDetailsOpen.job) {
                  handleApplyForJob(jobDetailsOpen.job);
                  setJobDetailsOpen({ open: false });
                }
              }}
            >
              {state.language === 'en' ? 'Apply Now' : 'تقدم الآن'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Job Alert Dialog */}
        <Dialog open={createAlertOpen} onClose={() => setCreateAlertOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {state.language === 'en' ? 'Create Job Alert' : 'إنشاء إشعار وظيفي'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              {state.language === 'en'
                ? 'Get notified about new jobs matching your criteria.'
                : 'احصل على إشعارات حول الوظائف الجديدة المتطابقة مع معاييرك.'
              }
            </DialogContentText>

            <TextField
              fullWidth
              label={state.language === 'en' ? 'Keywords' : 'الكلمات المفتاحية'}
              placeholder={state.language === 'en' ? 'e.g., developer, teacher' : 'مثال: مطور، معلم'}
              value={alertKeywords}
              onChange={(e) => setAlertKeywords(e.target.value)}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>
                {state.language === 'en' ? 'Category' : 'الفئة'}
              </InputLabel>
              <Select
                value={alertCategory}
                onChange={(e) => setAlertCategory(e.target.value)}
                label={state.language === 'en' ? 'Category' : 'الفئة'}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Alert severity="info" sx={{ mt: 2 }}>
              {state.language === 'en'
                ? 'You\'ll receive email notifications for matching jobs.'
                : 'ستتلقى إشعارات بالبريد الإلكتروني للوظائف المتطابقة.'
              }
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateAlertOpen(false)}>
              {state.language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button variant="contained" onClick={handleCreateJobAlert}>
              {state.language === 'en' ? 'Create Alert' : 'إنشاء الإشعار'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notifications Dialog */}
        <Dialog open={notificationsOpen} onClose={() => setNotificationsOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {state.language === 'en' ? 'Job Notifications' : 'إشعارات الوظائف'}
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <List>
              {mockNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${notification.color}20`, color: notification.color }}>
                        {React.createElement(notification.icon, { sx: { fontSize: 20 } })}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {notification.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < mockNotifications.length - 1 && <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}
                </React.Fragment>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNotificationsOpen(false)}>
              {state.language === 'en' ? 'Close' : 'إغلاق'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Filter Dialog */}
        <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {state.language === 'en' ? 'Filters' : 'التصفية'}
          </DialogTitle>
          <DialogContent>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              {state.language === 'en' ? 'Job Type' : 'نوع الوظيفة'}
            </Typography>
            {jobTypes.map(type => (
              <Box key={type} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <input
                  type="radio"
                  name="jobType"
                  value={type}
                  checked={selectedJobType === type}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {type}
                </Typography>
              </Box>
            ))}

            <Typography variant="subtitle2" sx={{ mb: 2, mt: 3 }}>
              {state.language === 'en' ? 'Categories' : 'الفئات'}
            </Typography>
            {categories.map(category => (
              <Box key={category} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {category}
                </Typography>
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setSelectedCategory('All');
              setSelectedJobType('All');
            }}>
              {state.language === 'en' ? 'Reset' : 'إعادة تعيين'}
            </Button>
            <Button variant="contained" onClick={() => setFilterDialogOpen(false)}>
              {state.language === 'en' ? 'Apply' : 'تطبيق'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Job Alert FAB */}
        <Fab
          color="primary"
          aria-label={state.language === 'en' ? 'Create Job Alert' : 'إنشاء إشعار وظيفي'}
          onClick={() => setCreateAlertOpen(true)}
          sx={{
            position: 'fixed',
            bottom: { xs: 100, sm: 24 },
            right: 24,
            zIndex: 1000,
          }}
        >
          <NotificationsActiveIcon />
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

export default EducationPage;
