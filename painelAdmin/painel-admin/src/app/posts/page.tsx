'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { postsAPI, categoriesAPI, usersAPI, Post, Category, User } from '@/lib/api';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatDate, truncateText } from '@/lib/utils';
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline';

const postSchema = z.object({
  nomePost: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  idCategoria: z.number().min(1, 'Categoria é obrigatória'),
  idUsuario: z.number().min(1, 'Usuário é obrigatório'),
  imagemPost: z.string().url('URL da imagem deve ser válida'),
});

type PostFormData = z.infer<typeof postSchema>;

export default function PostsPage() {
  const router = useRouter();
  const { isAuthenticated, canManageContent, isAdmin, currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadData();
  }, [isAuthenticated, router, currentPage, isAdmin, currentUser, selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar posts e categorias (todos os usuários podem acessar)
      const [postsRes, categoriesRes] = await Promise.all([
        postsAPI.getAll(currentPage, 10),
        categoriesAPI.getAll(1, 100),
      ]);
      
      // Filtrar posts por categoria se uma categoria estiver selecionada
      const filteredPosts = selectedCategory 
        ? postsRes.posts.filter(post => post.idCategoria === selectedCategory)
        : postsRes.posts;
      
      setPosts(filteredPosts);
      setTotalPages(postsRes.pagination.totalPages);
      setCategories(categoriesRes.categorias);
      
      // Carregar usuários apenas se for admin
      if (isAdmin) {
        const usersRes = await usersAPI.getAll(1, 100);
        setUsers(usersRes.usuarios);
      } else {
        // Para usuários não-admin, usar apenas o usuário atual
        if (currentUser) {
          setUsers([currentUser]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PostFormData) => {
    try {
      if (editingPost) {
        await postsAPI.update(editingPost.idPost, data);
      } else {
        await postsAPI.create(data);
      }
      
      setIsModalOpen(false);
      setEditingPost(null);
      reset();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar post:', error);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    reset({
      nomePost: post.nomePost,
      descricao: post.descricao,
      idCategoria: post.idCategoria,
      idUsuario: post.idUsuario,
      imagemPost: post.imagemPost,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      try {
        await postsAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Erro ao excluir post:', error);
      }
    }
  };

  const openCreateModal = () => {
    setEditingPost(null);
    reset();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    reset();
  };

  const getCategoryName = (id: number) => {
    const category = categories.find(c => c.idCategoria === id);
    return category?.nomeCategoria || 'N/A';
  };

  const getUserName = (id: number) => {
    const user = users.find(u => u.idUsuario === id);
    return user?.nomeUsuario || 'N/A';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Gerencie os posts do sistema
                  </p>
                </div>
                {canManageContent() && (
                  <Button onClick={openCreateModal}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Novo Post
                  </Button>
                )}
              </div>

              {/* Filtro por categoria */}
              <div className="bg-white p-4 rounded-lg shadow">
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por Categoria
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedCategory(value ? parseInt(value) : null);
                    setCurrentPage(1); // Resetar para primeira página ao filtrar
                  }}
                  className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border text-gray-900 bg-white"
                >
                  <option value="">Todas as categorias</option>
                  {categories.map((category) => (
                    <option key={category.idCategoria} value={category.idCategoria}>
                      {category.nomeCategoria}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.idPost}>
                      <TableCell>{post.idPost}</TableCell>
                      <TableCell className="font-medium">{post.nomePost}</TableCell>
                      <TableCell className="max-w-xs">
                        {truncateText(post.descricao, 50)}
                      </TableCell>
                      <TableCell>{getUserName(post.idUsuario)}</TableCell>
                      <TableCell>{formatDate(post.dataPost)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(post.imagemPost, '_blank')}
                            title="Visualizar imagem"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          {canManageContent() && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(post)}
                                title="Editar post"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(post.idPost)}
                                className="text-red-600 hover:text-red-700"
                                title="Excluir post"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <nav className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <span className="flex items-center px-3 py-2 text-sm text-gray-700">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingPost ? 'Editar Post' : 'Novo Post'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Título do Post"
            {...register('nomePost')}
            error={errors.nomePost?.message}
            placeholder="Digite o título do post"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              {...register('descricao')}
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-gray-900 placeholder-gray-500"
              placeholder="Digite a descrição do post"
            />
            {errors.descricao && (
              <p className="text-sm text-red-600 mt-1">{errors.descricao.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                {...register('idCategoria', { valueAsNumber: true })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-gray-900"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.idCategoria} value={category.idCategoria}>
                    {category.nomeCategoria}
                  </option>
                ))}
              </select>
              {errors.idCategoria && (
                <p className="text-sm text-red-600 mt-1">{errors.idCategoria.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autor
              </label>
              <select
                {...register('idUsuario', { valueAsNumber: true })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-gray-900"
              >
                <option value="">Selecione um autor</option>
                {users.map((user) => (
                  <option key={user.idUsuario} value={user.idUsuario}>
                    {user.nomeUsuario}
                  </option>
                ))}
              </select>
              {errors.idUsuario && (
                <p className="text-sm text-red-600 mt-1">{errors.idUsuario.message}</p>
              )}
            </div>
          </div>

          <Input
            label="URL da Imagem"
            {...register('imagemPost')}
            error={errors.imagemPost?.message}
            placeholder="https://exemplo.com/imagem.jpg"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingPost ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
