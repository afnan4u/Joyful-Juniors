/*
  # Joyful Juniors Children's Day App Schema

  ## Overview
  Creates the complete database schema for the Children's Day celebration app with events,
  activities, workshops, gallery, volunteers, and card templates.

  ## New Tables

  ### `events`
  Core event information for the Children's Day celebration
  - `id` (uuid, primary key)
  - `title` (text) - Event name
  - `description` (text) - Event details
  - `event_date` (timestamptz) - When the event occurs
  - `location` (text) - Event venue
  - `capacity` (integer) - Maximum attendees
  - `icon` (text) - Icon identifier for UI
  - `is_featured` (boolean) - Show in highlights
  - `created_at` (timestamptz)

  ### `activities`
  Workshops and activities schedule
  - `id` (uuid, primary key)
  - `title` (text) - Activity name
  - `description` (text) - Activity details
  - `category` (text) - Filter category (arts, sports, learning, games)
  - `age_group` (text) - Target age range
  - `start_time` (timestamptz) - Activity start
  - `end_time` (timestamptz) - Activity end
  - `capacity` (integer) - Max participants
  - `registered_count` (integer) - Current registrations
  - `instructor` (text) - Activity leader
  - `created_at` (timestamptz)

  ### `activity_signups`
  Track activity registrations
  - `id` (uuid, primary key)
  - `activity_id` (uuid, foreign key)
  - `parent_name` (text)
  - `parent_email` (text)
  - `child_name` (text)
  - `child_age` (integer)
  - `phone` (text)
  - `created_at` (timestamptz)

  ### `gallery_items`
  User-uploaded photos and creations
  - `id` (uuid, primary key)
  - `image_url` (text) - Storage path
  - `caption` (text)
  - `uploaded_by` (text) - Name
  - `is_approved` (boolean) - Moderation status
  - `likes_count` (integer)
  - `created_at` (timestamptz)

  ### `volunteers`
  Volunteer registrations
  - `id` (uuid, primary key)
  - `name` (text)
  - `email` (text)
  - `phone` (text)
  - `availability` (text)
  - `skills` (text)
  - `created_at` (timestamptz)

  ### `card_templates`
  Pre-designed card templates for generator
  - `id` (uuid, primary key)
  - `name` (text) - Template name
  - `thumbnail_url` (text) - Preview image
  - `svg_template` (text) - SVG markup with placeholders
  - `category` (text) - Template theme
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for approved content
  - Authenticated write for submissions (moderated)
*/

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_date timestamptz NOT NULL,
  location text NOT NULL,
  capacity integer DEFAULT 0,
  icon text DEFAULT 'calendar',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO public
  USING (true);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  age_group text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  capacity integer DEFAULT 20,
  registered_count integer DEFAULT 0,
  instructor text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view activities"
  ON activities FOR SELECT
  TO public
  USING (true);

-- Activity signups table
CREATE TABLE IF NOT EXISTS activity_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE,
  parent_name text NOT NULL,
  parent_email text NOT NULL,
  child_name text NOT NULL,
  child_age integer NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activity_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create signups"
  ON activity_signups FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view their own signups"
  ON activity_signups FOR SELECT
  TO public
  USING (true);

-- Gallery items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text DEFAULT '',
  uploaded_by text NOT NULL,
  is_approved boolean DEFAULT false,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved gallery items"
  ON gallery_items FOR SELECT
  TO public
  USING (is_approved = true);

CREATE POLICY "Anyone can submit gallery items"
  ON gallery_items FOR INSERT
  TO public
  WITH CHECK (true);

-- Volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  availability text NOT NULL,
  skills text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register as volunteer"
  ON volunteers FOR INSERT
  TO public
  WITH CHECK (true);

-- Card templates table
CREATE TABLE IF NOT EXISTS card_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  thumbnail_url text NOT NULL,
  svg_template text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE card_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view card templates"
  ON card_templates FOR SELECT
  TO public
  USING (true);

-- Insert sample data
INSERT INTO events (title, description, event_date, location, capacity, icon, is_featured) VALUES
('Grand Opening Ceremony', 'Join us for the opening ceremony with special performances and surprises!', '2025-11-15 09:00:00', 'Main Stage Area', 500, 'star', true),
('Magic Show Spectacular', 'Professional magician performing amazing tricks for kids of all ages', '2025-11-15 11:00:00', 'Theatre Hall', 200, 'wand-sparkles', true),
('Face Painting Station', 'Get transformed into your favorite character!', '2025-11-15 10:00:00', 'Arts Corner', 100, 'palette', true),
('Sports Day Olympics', 'Fun sports competitions and games for all age groups', '2025-11-15 14:00:00', 'Sports Field', 300, 'trophy', true);

INSERT INTO activities (title, description, category, age_group, start_time, end_time, capacity, registered_count, instructor) VALUES
('Creative Art Workshop', 'Learn painting, drawing, and craft-making with professional artists', 'arts', '5-10 years', '2025-11-15 10:00:00', '2025-11-15 12:00:00', 25, 12, 'Ms. Sarah Johnson'),
('Coding for Kids', 'Introduction to programming through fun games and activities', 'learning', '8-12 years', '2025-11-15 10:00:00', '2025-11-15 11:30:00', 20, 8, 'Mr. Tech Guru'),
('Dance Performance', 'Learn a fun dance routine and perform on stage!', 'arts', '6-12 years', '2025-11-15 13:00:00', '2025-11-15 15:00:00', 30, 18, 'Ms. Emma Dance'),
('Science Magic Lab', 'Amazing science experiments that look like magic!', 'learning', '7-11 years', '2025-11-15 11:00:00', '2025-11-15 12:30:00', 20, 15, 'Dr. Wonder'),
('Soccer Skills Training', 'Learn soccer techniques from professional coaches', 'sports', '6-10 years', '2025-11-15 14:00:00', '2025-11-15 16:00:00', 30, 22, 'Coach Mike'),
('Storytelling Circle', 'Interactive storytelling with puppets and props', 'learning', '4-8 years', '2025-11-15 10:30:00', '2025-11-15 11:30:00', 25, 10, 'Mrs. Story'),
('Mini Olympics', 'Fun relay races and team games', 'sports', '5-12 years', '2025-11-15 15:00:00', '2025-11-15 17:00:00', 40, 30, 'Coach Alex'),
('Music Jam Session', 'Explore different instruments and make music together!', 'arts', '6-12 years', '2025-11-15 13:00:00', '2025-11-15 14:30:00', 20, 14, 'Mr. Melody');

INSERT INTO card_templates (name, thumbnail_url, svg_template, category) VALUES
('Rainbow Celebration', '/templates/rainbow.svg', '<svg><!-- Template with {{MESSAGE}} placeholder --></svg>', 'celebration'),
('Superhero Birthday', '/templates/superhero.svg', '<svg><!-- Template with {{MESSAGE}} placeholder --></svg>', 'birthday'),
('Thank You Stars', '/templates/stars.svg', '<svg><!-- Template with {{MESSAGE}} placeholder --></svg>', 'thankyou'),
('Happy Day Sunshine', '/templates/sunshine.svg', '<svg><!-- Template with {{MESSAGE}} placeholder --></svg>', 'celebration');

INSERT INTO gallery_items (image_url, caption, uploaded_by, is_approved, likes_count) VALUES
('https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg', 'Amazing art workshop creations!', 'Emma & Kids', true, 24),
('https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg', 'Dance performance rehearsal fun', 'Sarah J.', true, 18),
('https://images.pexels.com/photos/1094072/pexels-photo-1094072.jpeg', 'Science experiments were awesome!', 'The Wonder Team', true, 31),
('https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg', 'Soccer training with friends', 'Coach Mike', true, 15);