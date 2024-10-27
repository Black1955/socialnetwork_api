import { RepositoryFactory } from '../factory/RepositoryFactory.js';
import { Context } from './strategy/Context.js';
import { StrategyMapper } from './strategy/StrategyMaper.js';
import { FileService } from './FileSerivce.js';
import { File } from '../../app/services/fileService/types/File.js';
export class PostService {
  private PostRepo;
  private FileService;
  constructor(Factory: RepositoryFactory, fileService: FileService) {
    this.FileService = fileService;
    this.PostRepo = Factory.CreatePostRepository();
  }
  async create(
    title: string,
    user_id: number,
    description: string,
    File?: File | File[]
  ) {
    if (typeof title !== 'string' || !title.trim()) {
      throw new Error('Title is empty or not a string');
    }

    let url: string | undefined;

    try {
      if (File) {
        const fileToUpload = Array.isArray(File) ? File[0] : File;
        const file = await this.FileService.upload(fileToUpload);
        url = Array.isArray(file) ? file[0]?.path : file?.path;
      }

      return await this.PostRepo.create(title, description, user_id, url);
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post');
    }
  }

  delete(id: number) {
    try {
      return this.PostRepo.delete(id);
    } catch (error) {}
  }
  getPost(id: number) {
    try {
      return this.PostRepo.getPost(id);
    } catch (error) {}
  }

  getPosts(
    id: number,
    page: number,
    limit: number,
    myId: number,
    type: string
  ) {
    try {
      const strategy = StrategyMapper(type, this.PostRepo);
      console.log('strategy', strategy);
      const context = new Context(strategy);
      return context.execute(id, page, limit, myId);
    } catch (error) {}
  }
  getUserPosts(id: number) {
    return this.PostRepo.getPosts(id);
  }
  like(id: number, post_id: number) {
    return this.PostRepo.like(id, post_id);
  }
  disLike(id: number, post_id: number) {
    return this.PostRepo.dislike(id, post_id);
  }
  getLikes(id: number) {
    return this.PostRepo.getLikes(id);
  }
}
