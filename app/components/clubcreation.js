'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import Navbar from '../../components/Navbar/layout';
import '../../styles/club-creation.css';
import { ArrowLeft, Users } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useRouter } from 'next/navigation';

const ClubCreation = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
const token = localStorage.getItem('token');

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      category: '',
    },
  });

  

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/club/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
            'Authorization': `Bearer ${token}`, // ✅ Add this

        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to create club');
      }

      toast({
        title: 'Club Created Successfully!',
        description: `"${data.name}" has been created and you are now the admin.`,
      });

      router.push('/clubs');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Mystery & Thriller',
    'Romance',
    'Science Fiction & Fantasy',
    'Biography & Memoir',
    'History',
    'Self-Help',
    'Business',
    'Young Adult',
    "Children's Books",
    'Poetry',
    'Other',
  ];

  return (
    <div className="club-creation-container">
      <Navbar
        isAuthenticated={true}
        user={{ name: 'John Doe', email: 'john@example.com' }}
      />

      <div className="club-creation-content">
        <div className="club-creation-header">
          <Button
            variant="ghost"
            onClick={() => router.push('/clubs')}
            className="mb-4 text-bookclub-gray hover:text-bookclub-navy"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clubs
          </Button>

          <h1 className="club-creation-title">Create Your Book Club</h1>
          <p className="club-creation-subtitle">
            Start a community around the books you love
          </p>
        </div>

        <Card className="club-creation-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-bookclub-navy">
              <Users className="h-5 w-5" />
              Club Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="club-creation-form">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Club Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your club name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what your club is about..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="w-full max-w-xs">
                        <FormLabel>Primary Category *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white shadow-lg border rounded-md w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="club-creation-button-group">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/clubs')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bookclub-gradient text-white"
                  >
                    {isSubmitting ? 'Creating Club...' : 'Create Club'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClubCreation;
