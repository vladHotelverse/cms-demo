import { APIRequestContext, APIResponse } from '@playwright/test';

export class APIHelpers {
  private request: APIRequestContext;
  private baseURL: string;

  constructor(request: APIRequestContext, baseURL: string = 'http://localhost:3000') {
    this.request = request;
    this.baseURL = baseURL;
  }

  async createOrder(orderData: any): Promise<APIResponse> {
    return await this.request.post(`${this.baseURL}/api/orders`, {
      data: orderData,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getOrder(orderId: string): Promise<APIResponse> {
    return await this.request.get(`${this.baseURL}/api/orders/${orderId}`);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<APIResponse> {
    return await this.request.patch(`${this.baseURL}/api/orders/${orderId}`, {
      data: { status },
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async deleteOrder(orderId: string): Promise<APIResponse> {
    return await this.request.delete(`${this.baseURL}/api/orders/${orderId}`);
  }

  async getAllOrders(): Promise<APIResponse> {
    return await this.request.get(`${this.baseURL}/api/orders`);
  }

  async createProposal(proposalData: any): Promise<APIResponse> {
    return await this.request.post(`${this.baseURL}/api/proposals`, {
      data: proposalData,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getProposals(): Promise<APIResponse> {
    return await this.request.get(`${this.baseURL}/api/proposals`);
  }

  async validateApiResponse(response: APIResponse, expectedStatus: number): Promise<any> {
    if (response.status() !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus}, got ${response.status()}`);
    }
    
    const responseBody = await response.json();
    return responseBody;
  }

  async createAuthenticatedRequest(token: string): Promise<{ [key: string]: string }> {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async batchCreateOrders(ordersData: any[], batchSize: number = 5): Promise<APIResponse[]> {
    const responses: APIResponse[] = [];
    
    for (let i = 0; i < ordersData.length; i += batchSize) {
      const batch = ordersData.slice(i, i + batchSize);
      const batchPromises = batch.map(orderData => this.createOrder(orderData));
      const batchResponses = await Promise.all(batchPromises);
      responses.push(...batchResponses);
    }
    
    return responses;
  }

  async waitForOrderStatus(orderId: string, expectedStatus: string, maxAttempts: number = 10): Promise<boolean> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const response = await this.getOrder(orderId);
      if (response.status() === 200) {
        const order = await response.json();
        if (order.status === expectedStatus) {
          return true;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    }
    return false;
  }

  async validateResponseSchema(response: APIResponse, requiredFields: string[]): Promise<void> {
    const data = await response.json();
    
    for (const field of requiredFields) {
      if (!(field in data)) {
        throw new Error(`Required field '${field}' missing from response`);
      }
    }
  }

  async performHealthCheck(): Promise<boolean> {
    try {
      const response = await this.request.get(`${this.baseURL}/api/health`);
      return response.status() === 200;
    } catch {
      return false;
    }
  }
}