export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  capacity: number;
  icon: string;
  is_featured: boolean;
  created_at: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  age_group: string;
  start_time: string;
  end_time: string;
  capacity: number;
  registered_count: number;
  instructor: string;
  created_at: string;
}

export interface ActivitySignup {
  activity_id: string;
  parent_name: string;
  parent_email: string;
  child_name: string;
  child_age: number;
  phone: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  uploaded_by: string;
  is_approved: boolean;
  likes_count: number;
  created_at: string;
}

export interface Volunteer {
  name: string;
  email: string;
  phone: string;
  availability: string;
  skills: string;
}

export interface CardTemplate {
  id: string;
  name: string;
  thumbnail_url: string;
  svg_template: string;
  category: string;
  created_at: string;
}
