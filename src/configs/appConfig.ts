import 'dotenv/config';
import { LocalUploader } from '../app/services/fileService/LocalUploader.js';
import { FileStackUploader } from '../app/services/fileService/FileStackUploader.js';
import { FileService } from '../domain/usecases/FileSerivce.js';
import { PostgresRepoFactory } from '../domain/factory/PostgresRepoFactory.js';
import { PostService } from '../domain/usecases/PostService.js';
import { UserService } from '../domain/usecases/UserService.js';
import { AuthService } from '../app/services/AuthService.js';
import { TokenService } from '../app/services/TokenService.js';
import { AuthController } from '../app/controllers/AuthController.js';
import { PetController } from '../app/controllers/PetController.js';
import { PostContorller } from '../app/controllers/PostController.js';
import { UserController } from '../app/controllers/UserController.js';

class AppConfig {
  // Declare service instances
  public authController: AuthController;
  public petController: PetController;
  public userController: UserController;
  public postController: PostContorller;

  private fileService: FileService;
  private postService: PostService;
  private userService: UserService;
  private tokenService: TokenService;
  private authService: AuthService;

  private postgresRepoFactory: PostgresRepoFactory;

  // Uploader services
  private uploader: LocalUploader | FileStackUploader;

  constructor() {
    // Repositories
    this.postgresRepoFactory = new PostgresRepoFactory();

    // Uploader selection based on environment variable
    if (process.env.USE_FILESTACK === 'true' && process.env.FILESTACK_API_KEY) {
      this.uploader = new FileStackUploader();
      console.log('Using FileStackUploader');
    } else {
      this.uploader = new LocalUploader();
      console.log('Using LocalUploader');
    }

    // Services
    this.fileService = new FileService(this.uploader);
    this.postService = new PostService(
      this.postgresRepoFactory,
      this.fileService
    );
    this.userService = UserService.getInstance(
      this.postgresRepoFactory,
      this.fileService
    );
    this.tokenService = new TokenService();
    this.authService = new AuthService(this.userService, this.tokenService);

    // Controllers
    this.authController = new AuthController(
      this.authService,
      this.tokenService
    );
    this.petController = new PetController(this.tokenService);
    this.userController = UserController.getInstance(
      this.userService,
      this.tokenService
    );
    this.postController = new PostContorller(
      this.postService,
      this.tokenService
    );
  }
}

export const appConfig = new AppConfig();
