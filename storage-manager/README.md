# Store Management Platform

## Description

This application is designed to streamline the daily operations of stores by automating inventory management, optimizing order processes, generating detailed reports, and supporting marketing campaigns through promotions and discounts. The platform is accessible via a web interface that supports multiple user roles, enabling specific activities tailored to each role, from Super Admin to Employee.

## Features

### Inventory Management

- **Product Display and Management**: Easily view and manage product details, including price and quantity updates.
- **Real-Time Monitoring**: Track and update stock levels instantly.
- [WIP] **Low-Stock Alerts**: Configure alerts for low inventory levels to ensure prompt restocking.

### Reporting

- **Advanced Reporting**: Generate detailed reports and visualizations on sales, trends, and stock performance.
- **PDF Generation**: Create and download reports in PDF format, including charts for events like price changes and quantity updates.

### Promotions and Discounts

- [WIP] **Flexible Campaigns**: Easily configure and manage promotions and discounts.

### User Roles and Authentication

- **User Roles**: Define and manage roles such as Super Admin, Admin, Manager, and Employee.
- **Role-Based Navigation**: Customize the navigation bar based on the user role.
- **Role-Based Access Control**: Restrict functionalities based on user roles.
- **Registration and Authentication**: Secure user registration and login system.

### Store Chains and Store Management

- **Store Chains Management**: Manage multiple store chains efficiently.
- **Store Management**: Oversee individual stores within a chain.

### Additional Features

- **Seed Scripts**: Populate the database with initial data using seed scripts.
- **Delete Confirmation Dialogs**: Ensure secure deletion of records with confirmation prompts.

## Design Patterns

- **Factory Method**:

  - **_Context_**:  
    The `Navbar` component dynamically returns a role-specific navbar (e.g., `SuperAdminNavbar`, `StoreEmployeeNavbar`) based on the user's role.
  - **_How It Works_**:

    - A single `Navbar` component gets the user role from the session.
    - Depending on the role, the component instantiates and returns the appropriate specialized navbar.

    ```tsx
    const Navbar = async () => {
      const session = await auth();

      switch (user.role) {
        case Role.SUPER_ADMIN:
          return <SuperAdminNavBar />;
        case Role.STORE_ADMIN:
          return <StoreAdminNavBar />;
        case Role.STORE_EMPLOYEE:
          return <StoreEmployeeNavBar />;
        default:
          return <></>;
      }
    };
    ```

  - **_Benefits_**:
    - Encapsulates role-specific logic into separate components.
    - Facilitates easy addition of new roles and navbars.

- **Facade**:

  - **_Context_**:  
    The `useReports` hook abstracts the complexity of fetching and processing data for different report types and provides a unified interface for rendering reports.
  - **_How It Works_**:

    - The hook fetches all required data and exposes a `renderReports` function.
    - The function dynamically delegates the rendering process to the appropriate rendering logic based on the report type.

    ```tsx
    const useReports = () => {
      const { data: saleReport } = api.router.getSaleReport.useQuery();
      const { data: priceChangeReport } = api.router.getSaleReport.useQuery();

      const renderReports = (reportType) => {
        switch (reportType) {
          case Event.SALE:
            return renderSaleReport(saleReport);
          case Event.PRICE_CHANGE:
            return renderPriceChangeReport(priceChangeReport);
          default:
            return null;
        }
      };

      return { renderReports };
    };
    ```

  - **_Benefits_**:
    - Simplifies the interface for rendering reports.
    - Hides the complexity of data fetching and processing.

- **Decorator**:

  - **_Context_**:  
    The TRPC query client enhances API calls with additional features like caching, invalidation, and error handling.
  - **_How It Works_**:
    - API calls are wrapped with functionalities such as optimistic updates using `useMutation`.
    - Example of invalidation:
    ```tsx
    const doDeleteProduct = api.product.delete.useMutation({
      onSuccess: async () => {
        await utils.product.getInfinite.invalidate();
        await utils.product.get.invalidate();
      },
      onError: (error) => {
        console.error(error);
      },
    });
    ```
  - **_Benefits_**:
    - Enhances core functionality (e.g., optimistic updates, error handling) without altering the main logic.
    - Promotes reusable and modular enhancements.

- **Observer**:

  - **_Context_**:  
    The Observer pattern is used in the product infinite scrolling implementation. Whenever new product data is needed, `useInView` (from `react-intersection-observer`) observes the scrolling behavior to fetch the next page.
  - **_How It Works_**:

    - `useInView` is used to detect when a user scrolls near the bottom of the product list.
    - When the observer triggers, `fetchNextPage` from `useInfiniteQuery` is called to fetch more products.

    ```tsx
    const {
      data: productsData,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
    } = api.product.getInfinite.useInfiniteQuery(
      {
        limit: 20,
        storeId: session.data?.user?.storeId ?? undefined,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
      },
    );

    const { ref, inView } = useInView();

    useEffect(() => {
      if (inView && hasNextPage) {
        fetchNextPage();
      }
    }, [inView, fetchNextPage, hasNextPage]);
    ```

  - **_Benefits_**:
    - Efficient and seamless data fetching triggered by user actions.
    - Reduces resource usage by loading data incrementally instead of all at once.

- **Strategy**:

  - **_Context_**:  
    The `renderReports` function dynamically selects the rendering logic based on the report type.
  - **_How It Works_**:

    - Each report type is associated with a distinct rendering strategy.
    - The function maps the report type to the appropriate rendering function and invokes it.

    ```tsx
    const useReports = () => {
      const { data: saleReport } = api.router.getSaleReport.useQuery();
      const { data: priceChangeReport } = api.router.getSaleReport.useQuery();

      const renderReports = (reportType) => {
        switch (reportType) {
          case Event.SALE:
            return renderSaleReport(saleReport);
          case Event.PRICE_CHANGE:
            return renderPriceChangeReport(priceChangeReport);
          default:
            return null;
        }
      };

      return { renderReports };
    ```

  - **_Benefits_**:
    - Encapsulates rendering logic for different report types.
    - Simplifies the addition of new report types.

- **Continuous Scrolling**:
  - **_Context_**:  
    `useInfiniteQuery` is used for implementing continuous scrolling, enabling seamless data fetching for products.
  - **_How It Works_**:
    - Data is fetched incrementally in pages as the user scrolls.
    - `useInfiniteQuery` provides utilities for fetching the next page when needed.
    ```tsx
    const {
      data: productsData,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
    } = api.product.getInfinite.useInfiniteQuery(
      {
        limit: 20,
        storeId: session.data?.user?.storeId ?? undefined,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
      },
    );
    ```
  - **_Benefits_**:
    - Improves user experience by loading data on demand.
    - Reduces initial load time and resource usage.

## Technology Stack

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Mantine UI](https://mantine.dev)
- [Recharts.js](https://recharts.org)
- [jsPDF](https://github.com/parallax/jsPDF)
- [html2canvas](https://html2canvas.hertzen.com)
- [zod](https://zod.dev)

The database used is [PostgreSQL](https://www.postgresql.org).

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RaduBesliu/storage-manager.git
   ```
2. Install dependencies:
   ```bash
   cd storage-manager
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Access the platform in your browser at `http://localhost:3000`.
2. Log in with your user credentials to explore and use the features based on your assigned role.

## License

This project is licensed under the [MIT License](LICENSE).
