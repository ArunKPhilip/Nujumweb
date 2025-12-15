import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert,
  Fab,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  NotificationsOutlined as NotificationsIcon,
  Group as GroupIcon,
  Event as EventIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Image as ImageIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Mock data for community features
const mockPosts = [
  {
    id: '1',
    authorId: 'user1',
    author: {
      username: 'Sarah Ahmed',
      profilePicture: '',
    },
    content: 'Just wanted to share my experience with wheelchair accessibility in Dubai. While some areas are great, there are still places that need improvement. Let\'s advocate for better access together!',
    imageUrl: null,
    likes: 12,
    isLiked: false,
    commentsCount: 5,
    createdAt: '2025-12-15T10:30:00Z',
  },
  {
    id: '2',
    authorId: 'user2',
    author: {
      username: 'Ahmed Hassan',
      profilePicture: '',
    },
    content: 'Looking for recommendations for adaptive sports programs in UAE. Any suggestions for wheelchair basketball or swimming facilities?',
    imageUrl: null,
    likes: 8,
    isLiked: true,
    commentsCount: 3,
    createdAt: '2025-12-14T15:45:00Z',
  },
  {
    id: '3',
    authorId: 'user3',
    author: {
      username: 'Fatima Al Mansoori',
      profilePicture: '',
    },
    content: 'Amazing physio session today! The new rehab center in Abu Dhabi has incredible facilities and supportive staff. Highly recommend!',
    imageUrl: null,
    likes: 15,
    isLiked: false,
    commentsCount: 7,
    createdAt: '2025-12-14T12:20:00Z',
  },
];

const mockGroups = [
  { id: 1, name: 'Sports Enthusiasts', members: 45, description: 'Sharing experiences about adaptive sports' },
  { id: 2, name: 'Healthcare Tips', members: 123, description: 'Tips and advice from healthcare professionals' },
  { id: 3, name: 'Tech & Accessibility', members: 78, description: 'Latest assistive technology discussions' },
  { id: 4, name: 'Career Support', members: 56, description: 'Jobs, opportunities, and career advice' },
  { id: 5, name: 'Parent Network', members: 91, description: 'Support for parents of children with disabilities' },
];

const mockEvents = [
  {
    id: 1,
    title: 'Wheelchair Basketball Tournament',
    date: '2025-12-20',
    time: '5:00 PM',
    location: 'Dubai Sports Complex',
    organizer: 'Dubai Sports Club',
    attendees: 25,
  },
  {
    id: 2,
    title: 'Assistive Technology Workshop',
    date: '2025-12-22',
    time: '10:00 AM',
    location: 'Abu Dhabi Convention Center',
    organizer: 'Tech Access UAE',
    attendees: 45,
  },
  {
    id: 3,
    title: 'Community Meetup',
    date: '2025-12-25',
    time: '2:00 PM',
    location: 'Sharjah Social Center',
    organizer: 'NUJJUM Community',
    attendees: 30,
  },
];

const mockNotifications = [
  {
    id: 1,
    type: 'comment',
    title: 'New comment on your post',
    message: 'Sarah Ahmed commented: "Great advice!"',
    time: '5 min ago',
    color: '#2196F3',
  },
  {
    id: 2,
    type: 'event',
    title: 'Event reminder',
    message: 'Wheelchair Basketball Tournament starts tomorrow',
    time: '1 hour ago',
    color: '#FF9800',
  },
  {
    id: 3,
    type: 'group',
    title: 'New group invitation',
    message: 'Ali invited you to join Sports Enthusiasts',
    time: '2 hours ago',
    color: '#4CAF50',
  },
];

const CommunityPage: React.FC = () => {
  const { state } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [posts, setPosts] = useState(mockPosts);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'success' });

  // Simulate real-time data loading
  useEffect(() => {
    // In a real app, this would be a subscription to Supabase or similar
    const interval = setInterval(() => {
      // Could fetch new posts here
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleCreatePost = () => {
    if (postContent.trim()) {
      const newPost = {
        id: Date.now().toString(),
        authorId: 'currentUser',
        author: {
          username: state.user?.username || 'You',
          profilePicture: state.user?.profilePicture || '',
        },
        content: postContent,
        imageUrl: null,
        likes: 0,
        isLiked: false,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
      };

      setPosts([newPost, ...posts]);
      setPostContent('');
      setCreatePostOpen(false);
      setSnackbar({ open: true, message: 'Post created successfully!', severity: 'success' });
    }
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked
          }
        : post
    ));
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

  const renderPostCard = (post: any) => (
    <Card
      sx={{
        mb: 2,
        transition: 'transform 0.3s ease',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={post.author.profilePicture}
            sx={{ mr: 2, bgcolor: 'primary.main' }}
          >
            {post.author.username.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" fontWeight={600}>
              {post.author.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTime(post.createdAt)}
            </Typography>
          </Box>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>

        {post.content && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            {post.content}
          </Typography>
        )}

        {post.imageUrl && (
          <Box sx={{
            width: '100%',
            height: 200,
            bgcolor: 'grey.100',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}>
            <Typography variant="body2" color="text.secondary">
              [Image Placeholder]
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="small"
              onClick={() => handleLikePost(post.id)}
              sx={{
                color: post.isLiked ? 'primary.main' : 'text.secondary',
                mr: 0.5,
              }}
            >
              {post.isLiked ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOutlinedIcon fontSize="small" />}
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              {post.likes}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" sx={{ color: 'text.secondary', mr: 0.5 }}>
              <CommentIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              {post.commentsCount}
            </Typography>
          </Box>

          <Box sx={{ mx: 'auto' }} />

          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <ShareIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  const renderGroupCard = (group: any) => (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
            <GroupIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              {group.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {group.members} members • {group.description}
            </Typography>
          </Box>
          <Button variant="contained">
            {state.language === 'en' ? 'Join' : 'انضم'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderEventCard = (event: any) => (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: 'warning.main' }}>
            <EventIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              {event.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {event.date} • {event.time} • {event.location}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              by {event.organizer} • {event.attendees} attending
            </Typography>
          </Box>
          <Button variant="contained">
            {state.language === 'en' ? 'RSVP' : 'رد'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight={600}>
            {state.language === 'en' ? 'Community' : 'المجتمع'}
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
          <Tab label={state.language === 'en' ? 'Feed' : 'الخلاصة'} />
          <Tab label={state.language === 'en' ? 'Groups' : 'المجموعات'} />
          <Tab label={state.language === 'en' ? 'Events' : 'الأحداث'} />
        </Tabs>

        {selectedTab === 0 && (
          <Box>
            {posts.length > 0 ? (
              posts.map(post => renderPostCard(post))
            ) : (
              renderEmptyState(SearchIcon, 'No posts yet', 'Start the conversation!')
            )}
          </Box>
        )}

        {selectedTab === 1 && (
          <Box>
            {mockGroups.map(group => renderGroupCard(group))}
          </Box>
        )}

        {selectedTab === 2 && (
          <Box>
            {mockEvents.map(event => renderEventCard(event))}
          </Box>
        )}

        {/* Create Post Dialog */}
        <Dialog
          open={createPostOpen}
          onClose={() => setCreatePostOpen(false)}
          maxWidth="sm"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '16px 16px 0 0',
              maxHeight: '80vh',
            },
          }}
        >
          <DialogTitle sx={{
            display: 'flex',
            alignItems: 'center',
            px: 3,
            py: 2,
          }}>
            <Box sx={{
              width: 4,
              height: 4,
              bgcolor: 'text.secondary',
              borderRadius: '50%',
              opacity: 0.3,
              mx: 'auto',
            }} />
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              {state.language === 'en' ? 'Create Post' : 'إنشاء منشور'}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder={state.language === 'en' ? "What's on your mind?" : 'ما الذي يدور في ذهنك؟'}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button startIcon={<ImageIcon />} sx={{ mr: 'auto' }}>
              {state.language === 'en' ? 'Photo' : 'صورة'}
            </Button>
            <Button onClick={() => setCreatePostOpen(false)}>
              {state.language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button
              variant="contained"
              onClick={handleCreatePost}
              disabled={!postContent.trim()}
            >
              {state.language === 'en' ? 'Post' : 'نشر'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notifications Dialog */}
        <Dialog open={notificationsOpen} onClose={() => setNotificationsOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {state.language === 'en' ? 'Notifications' : 'الإشعارات'}
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <List>
              {mockNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: notification.color + '20' }}>
                        <IconButton sx={{ color: notification.color }}>
                          {/* Dynamic icon based on type */}
                          {notification.type === 'comment' && <CommentIcon fontSize="small" />}
                          {notification.type === 'event' && <EventIcon fontSize="small" />}
                          {notification.type === 'group' && <GroupIcon fontSize="small" />}
                        </IconButton>
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
                  {index < mockNotifications.length - 1 && <Divider />}
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

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label={state.language === 'en' ? 'Create Post' : 'إنشاء منشور'}
          onClick={() => setCreatePostOpen(true)}
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

export default CommunityPage;
