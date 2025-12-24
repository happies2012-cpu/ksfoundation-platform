import { User } from './supabase';

// Email service for frontend applications
// In a production environment, this would call a backend service
export const emailService = {
  // Send task assignment email
  async sendTaskAssignment(assignee: User, taskTitle: string, workspaceName: string) {
    // In a real application, this would make an API call to a backend service
    // that handles email sending via SMTP or email service providers
    
    // For demonstration purposes, we'll log the email content
    const emailContent = {
      to: assignee.email,
      subject: `You have been assigned a new task: ${taskTitle}`,
      html: `
        <div>
          <h1>Task Assigned</h1>
          <p>Hello ${assignee.full_name},</p>
          <p>You have been assigned to a new task:</p>
          <div style="border: 1px solid #eee; padding: 16px; border-radius: 8px;">
            <h2>${taskTitle}</h2>
            <p>Workspace: ${workspaceName}</p>
          </div>
          <p><a href="${import.meta.env.VITE_APP_URL}/dashboard">View Task</a></p>
          <p>If you have any questions, please contact your team administrator.</p>
        </div>
      `
    };
    
    console.log('📧 Simulated Task Assignment Email:', JSON.stringify(emailContent, null, 2));
    
    // In a real implementation, you would make an API call like:
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(emailContent)
    // });
    // 
    // return response.ok;
    
    // For now, we'll simulate success
    return { success: true, messageId: 'simulated-task-assignment-email' };
  },

  // Send welcome email
  async sendWelcomeEmail(user: User) {
    // For demonstration purposes, we'll log the email content
    const emailContent = {
      to: user.email,
      subject: 'Welcome to TaskFlow!',
      html: `
        <div>
          <h1>Welcome to TaskFlow!</h1>
          <p>Hello ${user.full_name},</p>
          <p>Welcome to TaskFlow, your new team collaboration platform!</p>
          <p>Here's what you can do:</p>
          <ul>
            <li>Create and join workspaces</li>
            <li>Assign and complete tasks</li>
            <li>Collaborate with your team in real-time</li>
            <li>Track progress with our intuitive dashboard</li>
          </ul>
          <p><a href="${import.meta.env.VITE_APP_URL}/dashboard">Get Started</a></p>
          <p>If you have any questions, feel free to reach out to our support team.</p>
        </div>
      `
    };
    
    console.log('📧 Simulated Welcome Email:', JSON.stringify(emailContent, null, 2));
    
    // In a real implementation, you would make an API call to your backend
    // For now, we'll simulate success
    return { success: true, messageId: 'simulated-welcome-email' };
  },

  // Generic email sender
  async sendEmail(to: string, subject: string, html: string) {
    // For demonstration purposes, we'll log the email content
    const emailContent = {
      to,
      subject,
      html
    };
    
    console.log('📧 Simulated Email:', JSON.stringify(emailContent, null, 2));
    
    // In a real implementation, you would make an API call to your backend
    // For now, we'll simulate success
    return { success: true, messageId: 'simulated-generic-email' };
  }
};