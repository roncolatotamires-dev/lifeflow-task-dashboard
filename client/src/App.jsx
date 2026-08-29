import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TaskModal } from './components/TaskModal';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { LoginPage } from './pages/LoginPage';

const MainLayout = () => {
  const { user, loading } = useAuth();
  
  // Navigation & View State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'tasks' | 'categories'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeQuickFilter, setActiveQuickFilter] = useState(null);

  // Global Data
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchMetadata = async () => {
    if (!user) return;
    try {
      const [catData, tagData] = await Promise.all([
        api.getCategories(),
        api.getTags()
      ]);
      setCategories(catData.categories || []);
      setTags(tagData.tags || []);
    } catch (err) {
      console.error('Erro ao carregar dados de categorias e tags:', err);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, [user]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-muted)',
        fontWeight: '600'
      }}>
        Carregando LifeFlow...
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // Task Actions
  const handleOpenNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    if (taskData.id) {
      await api.updateTask(taskData.id, taskData);
    } else {
      await api.createTask(taskData);
    }
    await fetchMetadata();
  };

  // Category & Tag Actions
  const handleCreateCategory = async (catData) => {
    await api.createCategory(catData);
    await fetchMetadata();
  };

  const handleUpdateCategory = async (id, catData) => {
    await api.updateCategory(id, catData);
    await fetchMetadata();
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Excluir esta categoria? As tarefas associadas ficarão sem categoria.')) return;
    await api.deleteCategory(id);
    await fetchMetadata();
  };

  const handleCreateTag = async (tagData) => {
    await api.createTag(tagData);
    await fetchMetadata();
  };

  const handleDeleteTag = async (id) => {
    if (!window.confirm('Excluir esta tag?')) return;
    await api.deleteTag(id);
    await fetchMetadata();
  };

  const getPageTitle = () => {
    if (activeTab === 'dashboard') return 'Painel de Controle & Visão Geral';
    if (activeTab === 'tasks') return 'Gerenciador de Tarefas';
    if (activeTab === 'categories') return 'Categorias & Etiquetas';
    return 'LifeFlow';
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        activeQuickFilter={activeQuickFilter}
        setActiveQuickFilter={setActiveQuickFilter}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar
          title={getPageTitle()}
          onOpenNewTask={handleOpenNewTask}
        />

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'dashboard' && (
            <DashboardPage
              onOpenNewTask={handleOpenNewTask}
              onViewAllTasks={() => {
                setActiveTab('tasks');
                setSelectedCategory(null);
                setActiveQuickFilter(null);
              }}
              onEditTask={handleEditTask}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksPage
              onOpenNewTask={handleOpenNewTask}
              onEditTask={handleEditTask}
              categories={categories}
              tags={tags}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              activeQuickFilter={activeQuickFilter}
              setActiveQuickFilter={setActiveQuickFilter}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesPage
              categories={categories}
              tags={tags}
              onCreateCategory={handleCreateCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              onCreateTag={handleCreateTag}
              onDeleteTag={handleDeleteTag}
            />
          )}
        </main>
      </div>

      {/* Global Task Creation / Editing Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
        categories={categories}
        tags={tags}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
