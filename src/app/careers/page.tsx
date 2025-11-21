import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Code, 
  Palette, 
  Shield, 
  Headphones,
  Globe,
  Heart,
  Coffee,
  Zap,
  Award
} from "lucide-react";

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  icon: any;
}

export default function Careers() {
  const jobListings: JobListing[] = [
    {
      id: '1',
      title: 'Senior Full-Stack Developer',
      department: 'Engineering',
      location: 'Remote / San Francisco',
      type: 'Full-time',
      salary: '$120K - $180K',
      description: 'Join our engineering team to build scalable cloud infrastructure and modern web applications using Next.js, Node.js, and cloud technologies.',
      requirements: [
        '5+ years of full-stack development experience',
        'Expertise in React, Next.js, Node.js, and TypeScript',
        'Experience with cloud platforms (AWS, GCP, Azure)',
        'Knowledge of containerization and microservices',
        'Strong problem-solving and communication skills'
      ],
      benefits: [
        'Competitive salary and equity package',
        'Comprehensive health, dental, and vision insurance',
        'Flexible work arrangements and unlimited PTO',
        'Latest tech equipment and home office setup',
        'Professional development budget'
      ],
      icon: Code
    },
    {
      id: '2',
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Remote / New York',
      type: 'Full-time',
      salary: '$90K - $130K',
      description: 'Create beautiful, intuitive user experiences for our cloud platform and help shape the future of hosting and development services.',
      requirements: [
        '3+ years of UI/UX design experience',
        'Proficiency in Figma, Sketch, or similar design tools',
        'Strong portfolio showcasing web and mobile designs',
        'Understanding of user-centered design principles',
        'Experience with design systems and component libraries'
      ],
      benefits: [
        'Creative freedom and design leadership opportunities',
        'Access to premium design tools and resources',
        'Collaborative and creative work environment',
        'Remote-first culture with quarterly team meetups',
        'Learning and development opportunities'
      ],
      icon: Palette
    },
    {
      id: '3',
      title: 'DevOps Engineer',
      department: 'Infrastructure',
      location: 'Remote / Austin',
      type: 'Full-time',
      salary: '$110K - $160K',
      description: 'Build and maintain our cloud infrastructure, ensuring high availability, scalability, and security for our hosting services.',
      requirements: [
        '4+ years of DevOps/Infrastructure experience',
        'Expertise in Kubernetes, Docker, and container orchestration',
        'Experience with infrastructure as code (Terraform, CloudFormation)',
        'Knowledge of monitoring and logging tools',
        'Strong scripting skills (Python, Bash, PowerShell)'
      ],
      benefits: [
        'Work with cutting-edge cloud technologies',
        'Significant impact on platform reliability',
        'Flexible schedule and remote work options',
        'Conference attendance and certification support',
        'Stock options and performance bonuses'
      ],
      icon: Shield
    },
    {
      id: '4',
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote / Chicago',
      type: 'Full-time',
      salary: '$70K - $100K',
      description: 'Help our customers succeed by providing exceptional support, onboarding, and ongoing relationship management.',
      requirements: [
        '2+ years of customer success or account management experience',
        'Excellent communication and interpersonal skills',
        'Technical aptitude and willingness to learn',
        'Experience with CRM and support ticketing systems',
        'Problem-solving mindset and customer-first attitude'
      ],
      benefits: [
        'Direct impact on customer satisfaction',
        'Growth opportunities within the company',
        'Comprehensive training and development',
        'Team collaboration and mentorship',
        'Work-life balance and flexible hours'
      ],
      icon: Headphones
    },
    {
      id: '5',
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Remote / Los Angeles',
      type: 'Full-time',
      salary: '$60K - $90K',
      description: 'Drive growth through digital marketing campaigns, content creation, and community engagement across multiple channels.',
      requirements: [
        '2+ years of digital marketing experience',
        'Experience with SEO, SEM, and social media marketing',
        'Content creation and copywriting skills',
        'Analytics and data-driven decision making',
        'Knowledge of marketing automation tools'
      ],
      benefits: [
        'Creative and dynamic work environment',
        'Opportunity to build and scale marketing programs',
        'Access to marketing tools and platforms',
        'Professional growth and learning opportunities',
        'Collaborative team culture'
      ],
      icon: Globe
    },
    {
      id: '6',
      title: 'Backend Developer',
      department: 'Engineering',
      location: 'Remote / Seattle',
      type: 'Full-time',
      salary: '$100K - $140K',
      description: 'Build robust APIs and backend services that power our hosting platform and support millions of requests daily.',
      requirements: [
        '3+ years of backend development experience',
        'Proficiency in Node.js, Python, or Go',
        'Experience with databases (PostgreSQL, MongoDB, Redis)',
        'Knowledge of API design and microservices architecture',
        'Understanding of security best practices'
      ],
      benefits: [
        'Work on high-scale distributed systems',
        'Mentorship from senior engineering team',
        'Flexible work environment and hours',
        'Latest development tools and technologies',
        'Career advancement opportunities'
      ],
      icon: Code
    }
  ];

  const companyBenefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health, dental, and vision insurance with mental health support'
    },
    {
      icon: Coffee,
      title: 'Work-Life Balance',
      description: 'Unlimited PTO, flexible hours, and remote-first culture'
    },
    {
      icon: Zap,
      title: 'Growth & Learning',
      description: 'Professional development budget, conference attendance, and certification support'
    },
    {
      icon: Award,
      title: 'Compensation',
      description: 'Competitive salaries, equity packages, and performance bonuses'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Aryan Tech Solution
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Help us build the future of cloud hosting and development services. We're looking for passionate, 
            talented individuals who want to make a real impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              View Open Positions
            </Button>
            <Button variant="outline">
              Learn About Our Culture
            </Button>
          </div>
        </div>

        {/* Company Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Work With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyBenefits.map((benefit, index) => (
              <Card key={index} className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Job Listings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Open Positions</h2>
          <div className="space-y-6">
            {jobListings.map((job) => (
              <Card key={job.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <job.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">{job.title}</CardTitle>
                        <CardDescription className="text-blue-600 font-medium">{job.department}</CardDescription>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Apply Now
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.type}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {job.salary}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <h4 className="font-semibold text-gray-900 mb-2">About the Role</h4>
                      <p className="text-gray-600 mb-4">{job.description}</p>
                      
                      <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {job.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Process */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-16">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Our Hiring Process</CardTitle>
            <CardDescription className="text-center">What to expect when you apply</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Application</h3>
                <p className="text-sm text-gray-600">Submit your application and resume</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Phone Screen</h3>
                <p className="text-sm text-gray-600">Initial conversation with our team</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Technical/Skills</h3>
                <p className="text-sm text-gray-600">Role-specific assessment or interview</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Final Interview</h3>
                <p className="text-sm text-gray-600">Meet the team and culture fit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Don't See the Right Role?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. If you're passionate about 
              cloud technology and want to be part of our mission, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Send Us Your Resume
              </Button>
              <Button variant="outline">
                <Link href="/contact">Contact Our Team</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex space-x-6">
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                Terms of Service
              </Link>
              <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 font-medium">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                Contact Us
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 Aryan Tech Solution. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
