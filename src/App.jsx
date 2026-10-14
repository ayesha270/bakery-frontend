import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [shelfLife, setShelfLife] = useState('');

  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState('');
  const [unit, setUnit] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [reorderLevel, setReorderLevel] = useState('');

  const [suppliers, setSuppliers] = useState([]);
  const [supplierName, setSupplierName] = useState('');
  const [contact, setContact] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');

  const [staffList, setStaffList] = useState([]);
  const [staffName, setStaffName] = useState('');
  const [role, setRole] = useState('');
  const [shift, setShift] = useState('');

  const [orders, setOrders] = useState([]);
  const [orderCustomer, setOrderCustomer] = useState('');
  const [orderStaff, setOrderStaff] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [orderType, setOrderType] = useState('Walk-in');
  const [orderProduct, setOrderProduct] = useState('');
  const [orderQuantity, setOrderQuantity] = useState('');

  const [payments, setPayments] = useState([]);
  const [paymentOrder, setPaymentOrder] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');

  const fetchCustomers = () => fetch('http://127.0.0.1:8000/api/customers/').then(r => r.json()).then(setCustomers);
  const fetchProducts = () => fetch('http://127.0.0.1:8000/api/products/').then(r => r.json()).then(setProducts);
  const fetchIngredients = () => fetch('http://127.0.0.1:8000/api/ingredients/').then(r => r.json()).then(setIngredients);
  const fetchSuppliers = () => fetch('http://127.0.0.1:8000/api/suppliers/').then(r => r.json()).then(setSuppliers);
  const fetchStaff = () => fetch('http://127.0.0.1:8000/api/staff/').then(r => r.json()).then(setStaffList);
  const fetchOrders = () => fetch('http://127.0.0.1:8000/api/orders/').then(r => r.json()).then(setOrders);
  const fetchPayments = () => fetch('http://127.0.0.1:8000/api/payments/').then(r => r.json()).then(setPayments);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchIngredients();
    fetchSuppliers();
    fetchStaff();
    fetchOrders();
    fetchPayments();
  }, []);

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/customers/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, address }),
    }).then(r => r.json()).then(() => {
      setName(''); setPhone(''); setAddress('');
      fetchCustomers();
    });
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/products/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: productName, category, price, shelf_life_days: shelfLife }),
    }).then(r => r.json()).then(() => {
      setProductName(''); setCategory(''); setPrice(''); setShelfLife('');
      fetchProducts();
    });
  };

  const handleIngredientSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/ingredients/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: ingredientName, unit, current_stock: currentStock, reorder_level: reorderLevel }),
    }).then(r => r.json()).then(() => {
      setIngredientName(''); setUnit(''); setCurrentStock(''); setReorderLevel('');
      fetchIngredients();
    });
  };

  const handleSupplierSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/suppliers/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: supplierName, contact, address: supplierAddress }),
    }).then(r => r.json()).then(() => {
      setSupplierName(''); setContact(''); setSupplierAddress('');
      fetchSuppliers();
    });
  };

  const handleStaffSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/staff/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: staffName, role, shift }),
    }).then(r => r.json()).then(() => {
      setStaffName(''); setRole(''); setShift('');
      fetchStaff();
    });
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/orders/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: orderCustomer,
        staff: orderStaff,
        delivery_date: deliveryDate,
        order_type: orderType,
        status: 'Pending',
      }),
    })
      .then((r) => r.json())
      .then((createdOrder) => {
        const selectedProduct = products.find(p => p.product_id === parseInt(orderProduct));
        return fetch('http://127.0.0.1:8000/api/order-items/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order: createdOrder.order_id,
            product: orderProduct,
            quantity: orderQuantity,
            price: selectedProduct ? selectedProduct.price : 0,
          }),
        });
      })
      .then(() => {
        setOrderCustomer(''); setOrderStaff(''); setDeliveryDate('');
        setOrderType('Walk-in'); setOrderProduct(''); setOrderQuantity('');
        fetchOrders();
      })
      .catch((error) => console.error('Error creating order:', error));
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/payments/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order: paymentOrder,
        amount,
        payment_mode: paymentMode,
        payment_status: 'Paid',
      }),
    }).then(r => r.json()).then(() => {
      setPaymentOrder(''); setAmount('');
      fetchPayments();
    });
  };

  return (
    <div className="app-container">
      <h1 className="main-title">🍞 Bakery Management System</h1>

      <div className="section-card">
        <h2 className="section-title">👤 Add New Customer</h2>
        <form onSubmit={handleCustomerSubmit}>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <button type="submit">Add Customer</button>
        </form>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Address</th></tr></thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.customer_id}><td>{c.customer_id}</td><td>{c.name}</td><td>{c.phone}</td><td>{c.address}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title">🧁 Add New Product</h2>
        <form onSubmit={handleProductSubmit}>
          <input type="text" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} required />
          <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <input type="number" placeholder="Shelf Life (days)" value={shelfLife} onChange={(e) => setShelfLife(e.target.value)} />
          <button type="submit">Add Product</button>
        </form>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Shelf Life</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.product_id}><td>{p.product_id}</td><td>{p.name}</td><td>{p.category}</td><td>{p.price}</td><td>{p.shelf_life_days}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title">🌾 Add New Ingredient</h2>
        <form onSubmit={handleIngredientSubmit}>
          <input type="text" placeholder="Ingredient Name" value={ingredientName} onChange={(e) => setIngredientName(e.target.value)} required />
          <input type="text" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
          <input type="number" placeholder="Current Stock" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} />
          <input type="number" placeholder="Reorder Level" value={reorderLevel} onChange={(e) => setReorderLevel(e.target.value)} />
          <button type="submit">Add Ingredient</button>
        </form>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Unit</th><th>Stock</th><th>Reorder Level</th></tr></thead>
            <tbody>
              {ingredients.map((i) => (
                <tr key={i.ingredient_id}><td>{i.ingredient_id}</td><td>{i.name}</td><td>{i.unit}</td><td>{i.current_stock}</td><td>{i.reorder_level}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title">🚚 Add New Supplier</h2>
        <form onSubmit={handleSupplierSubmit}>
          <input type="text" placeholder="Supplier Name" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} required />
          <input type="text" placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} />
          <input type="text" placeholder="Address" value={supplierAddress} onChange={(e) => setSupplierAddress(e.target.value)} />
          <button type="submit">Add Supplier</button>
        </form>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Contact</th><th>Address</th></tr></thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.supplier_id}><td>{s.supplier_id}</td><td>{s.name}</td><td>{s.contact}</td><td>{s.address}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title">👩‍🍳 Add New Staff</h2>
        <form onSubmit={handleStaffSubmit}>
          <input type="text" placeholder="Staff Name" value={staffName} onChange={(e) => setStaffName(e.target.value)} required />
          <input type="text" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
          <input type="text" placeholder="Shift" value={shift} onChange={(e) => setShift(e.target.value)} />
          <button type="submit">Add Staff</button>
        </form>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Shift</th></tr></thead>
            <tbody>
              {staffList.map((s) => (
                <tr key={s.staff_id}><td>{s.staff_id}</td><td>{s.name}</td><td>{s.role}</td><td>{s.shift}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title">🛒 Create New Order</h2>
        <form onSubmit={handleOrderSubmit}>
          <select value={orderCustomer} onChange={(e) => setOrderCustomer(e.target.value)} required>
            <option value="">-- Select Customer --</option>
            {customers.map((c) => (<option key={c.customer_id} value={c.customer_id}>{c.name}</option>))}
          </select>
          <select value={orderStaff} onChange={(e) => setOrderStaff(e.target.value)}>
            <option value="">-- Select Staff --</option>
            {staffList.map((s) => (<option key={s.staff_id} value={s.staff_id}>{s.name}</option>))}
          </select>
          <select value={orderProduct} onChange={(e) => setOrderProduct(e.target.value)} required>
            <option value="">-- Select Product --</option>
            {products.map((p) => (<option key={p.product_id} value={p.product_id}>{p.name} (Rs. {p.price})</option>))}
          </select>
          <input type="number" placeholder="Quantity" value={orderQuantity} onChange={(e) => setOrderQuantity(e.target.value)} required />
          <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
            <option value="Walk-in">Walk-in</option>
            <option value="Custom">Custom</option>
          </select>
          <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
          <button type="submit">Create Order</button>
        </form>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Type</th><th>Status</th><th>Delivery Date</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.order_id}>
                  <td>{o.order_id}</td><td>{o.customer}</td><td>{o.order_type}</td><td>{o.status}</td><td>{o.delivery_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title">💰 Record Payment</h2>
        <form onSubmit={handlePaymentSubmit}>
          <select value={paymentOrder} onChange={(e) => setPaymentOrder(e.target.value)} required>
            <option value="">-- Select Order --</option>
            {orders.map((o) => (<option key={o.order_id} value={o.order_id}>Order #{o.order_id}</option>))}
          </select>
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Advance">Advance</option>
          </select>
          <button type="submit">Record Payment</button>
        </form>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Payment ID</th><th>Order</th><th>Amount</th><th>Mode</th><th>Status</th></tr></thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.payment_id}>
                  <td>{p.payment_id}</td><td>Order #{p.order}</td><td>{p.amount}</td><td>{p.payment_mode}</td><td>{p.payment_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;