
import { Instructor, Student, CertBody, UserRole, SkiLevel, Resort } from '../types';

export const MOCK_RESORTS: Resort[] = [
  // Japan - Hokkaido
  { id: 'resort-niseko', name: 'Niseko United', region: 'Hokkaido', country: 'Japan' },
  { id: 'resort-rusutsu', name: 'Rusutsu Resort', region: 'Hokkaido', country: 'Japan' },
  { id: 'resort-furano', name: 'Furano Ski Resort', region: 'Hokkaido', country: 'Japan' },
  // Japan - Nagano
  { id: 'resort-hakuba', name: 'Hakuba Valley', region: 'Nagano', country: 'Japan' },
  { id: 'resort-nozawa', name: 'Nozawa Onsen', region: 'Nagano', country: 'Japan' },
  { id: 'resort-shiga', name: 'Shiga Kogen', region: 'Nagano', country: 'Japan' },
  // Europe
  { id: 'resort-courchevel', name: 'Courchevel', region: 'Three Valleys', country: 'France' },
  { id: 'resort-zermatt', name: 'Zermatt', region: 'Valais', country: 'Switzerland' },
  // North America
  { id: 'resort-whistler', name: 'Whistler Blackcomb', region: 'BC', country: 'Canada' },
  { id: 'resort-aspen', name: 'Aspen Snowmass', region: 'Colorado', country: 'USA' },
];

export const MOCK_STUDENT: Student = {
  id: 'student-demo',
  name: 'Alex Rider',
  role: UserRole.STUDENT,
  bio: 'Intermediate skier looking to conquer black diamonds. Love apres-ski as much as the slopes!',
  photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
  location: 'Niseko, Japan',
  level: SkiLevel.INTERMEDIATE,
  lookingFor: 'Powder skiing and off-piste techniques',
  // Missing gender and nationality to trigger the flow
};

export const MOCK_INSTRUCTORS: Instructor[] = [
  {
    id: 'inst-1',
    name: 'Liam Neeson',
    role: UserRole.INSTRUCTOR,
    bio: 'Passionate about powder and deep snow. 10 years teaching in Niseko.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    location: 'Niseko, Japan',
    certifications: [
        { body: CertBody.CSIA, level: 3, licenseNumber: 'CSIA-99821' }
    ],
    yearsExperience: 10,
    hourlyRate: 80,
    specialties: ['Powder', 'Backcountry', 'Kids'],
    languages: ['English', 'French'],
    rating: 4.9,
    reviewCount: 42,
    availableResorts: ['resort-niseko', 'resort-rusutsu', 'resort-furano']
  },
  {
    id: 'inst-2',
    name: 'Sarah Chen',
    role: UserRole.INSTRUCTOR,
    bio: 'Former competitive racer. I focus on carving technique and high-speed control.',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    location: 'Courchevel, France',
    certifications: [
        { body: CertBody.BASI, level: 4, licenseNumber: 'BASI-11203' },
        { body: CertBody.ISIA, level: 1, licenseNumber: 'ISIA-554' }
    ],
    yearsExperience: 8,
    hourlyRate: 120,
    specialties: ['Racing', 'Carving', 'Advanced'],
    languages: ['English', 'Mandarin', 'French'],
    rating: 5.0,
    reviewCount: 88,
    availableResorts: ['resort-courchevel', 'resort-zermatt', 'resort-niseko']
  },
  {
    id: 'inst-3',
    name: 'Mike Johnson',
    role: UserRole.INSTRUCTOR,
    bio: 'Freestyle specialist. Let me teach you how to hit your first 360 in the park.',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    location: 'Whistler, Canada',
    certifications: [
        { body: CertBody.CASI, level: 2, licenseNumber: 'CASI-7741' }
    ],
    yearsExperience: 4,
    hourlyRate: 60,
    specialties: ['Park', 'Freestyle', 'Snowboard'],
    languages: ['English'],
    rating: 4.7,
    reviewCount: 15,
    availableResorts: ['resort-whistler', 'resort-hakuba']
  },
  {
    id: 'inst-4',
    name: 'Elena Popov',
    role: UserRole.INSTRUCTOR,
    bio: 'Patient and encouraging. Perfect for first-timers who are nervous.',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    location: 'Zermatt, Switzerland',
    certifications: [
        { body: CertBody.ISIA, level: 3, licenseNumber: 'ISIA-9901' }
    ],
    yearsExperience: 15,
    hourlyRate: 90,
    specialties: ['Beginners', 'Kids', 'Confidence'],
    languages: ['English', 'Russian', 'German'],
    rating: 4.8,
    reviewCount: 120,
    availableResorts: ['resort-zermatt', 'resort-courchevel']
  },
  {
    id: 'inst-5',
    name: 'Kenji Sato',
    role: UserRole.INSTRUCTOR,
    bio: 'Local Niseko guide. I know all the secret spots that aren\'t on the map.',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    location: 'Niseko, Japan',
    certifications: [
        { body: CertBody.SIA, level: 4, licenseNumber: 'SIA-0012' }
    ],
    yearsExperience: 20,
    hourlyRate: 150,
    specialties: ['Guiding', 'Deep Powder', 'Culture'],
    languages: ['Japanese', 'English'],
    rating: 4.9,
    reviewCount: 210,
    availableResorts: ['resort-niseko', 'resort-rusutsu', 'resort-hakuba']
  },
  {
    id: 'inst-6',
    name: 'Jessica Miller',
    role: UserRole.INSTRUCTOR,
    bio: 'Snowboard pro turned instructor. Lets make your riding look effortless.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    location: 'Aspen, USA',
    certifications: [
        { body: CertBody.PSIA_AASI, level: 3, licenseNumber: 'PSIA-W-445' }
    ],
    yearsExperience: 6,
    hourlyRate: 110,
    specialties: ['Snowboard', 'Style', 'Intermediates'],
    languages: ['English', 'Spanish'],
    rating: 4.6,
    reviewCount: 34,
    availableResorts: ['resort-aspen', 'resort-whistler']
  }
];
