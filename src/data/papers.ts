import { Category } from '../types/paper';

export const categories: Category[] = [
  {
    id: 'llm',
    name: 'Large Language Models',
    papers: [
      {
        id: '1',
        title: 'GPT-4 Technical Report',
        authors: ['OpenAI'],
        abstract: 'GPT-4 is a large multimodal model capable of processing image and text inputs and generating text outputs. This technical report presents the capabilities, limitations, and safety properties of the model.',
        category: 'llm',
        publishDate: '2023-03-15',
        conference: 'arXiv',
        url: 'https://arxiv.org/abs/2303.08774'
      },
      {
        id: '2',
        title: 'PaLM: Scaling Language Modeling with Pathways',
        authors: ['Google Research'],
        abstract: 'We present PaLM, a 540-billion parameter language model trained on the Pathways system, demonstrating breakthrough performance on hundreds of language tasks.',
        category: 'llm',
        publishDate: '2022-04-05',
        conference: 'arXiv',
        url: 'https://arxiv.org/abs/2204.02311'
      },
      {
        id: '3',
        title: 'Constitutional AI: A Framework for Machine Learning Systems That Respect Human Values',
        authors: ['Anthropic'],
        abstract: 'We present a framework for training AI systems to respect human values and ethical principles through careful objective design and training procedures.',
        category: 'llm',
        publishDate: '2023-12-01',
        conference: 'NeurIPS 2023',
        url: 'https://arxiv.org/abs/2310.07878'
      },
      {
        id: '11',
        title: 'Gemini: A Family of Highly Capable Multimodal Models',
        authors: ['Google DeepMind'],
        abstract: 'We present Gemini, a family of multimodal models that demonstrate remarkable capabilities across image, audio, video, and text understanding. The models achieve state-of-the-art performance across a wide spectrum of tasks and benchmarks.',
        category: 'llm',
        publishDate: '2023-12-06',
        conference: 'arXiv',
        url: 'https://arxiv.org/abs/2312.11805'
      },
      {
        id: '12',
        title: 'Claude 3: A Next-Generation AI Assistant',
        authors: ['Anthropic'],
        abstract: 'We introduce Claude 3, a significant advancement in AI assistance capabilities. The model demonstrates improved reasoning, safety features, and multimodal understanding while maintaining high levels of reliability and truthfulness.',
        category: 'llm',
        publishDate: '2024-03-04',
        conference: 'Anthropic Blog',
        url: 'https://www.anthropic.com/news/claude-3'
      }
    ]
  },
  {
    id: 'cv',
    name: 'Computer Vision',
    papers: [
      {
        id: 'cv1',
        title: 'SORA: Creating Video From Text Using Diffusion Models',
        authors: ['OpenAI Research Team'],
        abstract: 'We present SORA, a text-to-video diffusion model capable of generating highly realistic and coherent videos from text descriptions. The model demonstrates unprecedented capabilities in video synthesis, spatial and temporal consistency, and understanding of physical dynamics.',
        category: 'cv',
        publishDate: '2024-02-15',
        conference: 'OpenAI Technical Report',
        url: 'https://openai.com/sora'
      },
      {
        id: 'cv2',
        title: 'DreamFusion: Text-to-3D using 2D Diffusion',
        authors: ['Ben Poole', 'Ajay Jain', 'Jonathan T. Barron', 'Ben Mildenhall'],
        abstract: 'We present a method for generating 3D objects from text descriptions, combining the knowledge of a pretrained 2D text-to-image diffusion model with an optimization process that produces a 3D object.',
        category: 'cv',
        publishDate: '2023-07-12',
        conference: 'ICCV 2023',
        url: 'https://arxiv.org/abs/2209.14988'
      },
      {
        id: 'cv3',
        title: 'Segment Anything',
        authors: ['Alexander Kirillov', 'Eric Mintun', 'Nikhila Ravi', 'Hanzi Mao', 'Chloe Rolland', 'Laura Gustafson', 'Tete Xiao', 'Spencer Whitehead', 'Alexander C. Berg', 'Wan-Yen Lo', 'Piotr Dollar', 'Ross Girshick'],
        abstract: 'We present the Segment Anything Model (SAM) for promptable segmentation. SAM is a foundation model for image segmentation that is trained on a vast dataset of 1B masks, demonstrating remarkable zero-shot generalization.',
        category: 'cv',
        publishDate: '2023-04-05',
        conference: 'ICCV 2023',
        url: 'https://arxiv.org/abs/2304.02643'
      },
      {
        id: 'cv4',
        title: 'DALL·E 3: Improving Image Generation with Better Captions',
        authors: ['OpenAI'],
        abstract: 'We introduce DALL·E 3, a state-of-the-art text-to-image generation model that demonstrates significant improvements in following complex prompts, handling text rendering, and maintaining spatial consistency.',
        category: 'cv',
        publishDate: '2023-09-20',
        conference: 'OpenAI Technical Report',
        url: 'https://openai.com/dall-e-3'
      },
      {
        id: 'cv5',
        title: 'Stable Video Diffusion: Scaling Latent Video Diffusion Models to Large Datasets',
        authors: ['Stability AI Research Team'],
        abstract: 'We present Stable Video Diffusion, a model for high-quality video generation trained on a large-scale video dataset. Our approach extends image diffusion models to the video domain while maintaining temporal consistency.',
        category: 'cv',
        publishDate: '2023-11-21',
        conference: 'arXiv',
        url: 'https://arxiv.org/abs/2311.15127'
      },
      {
        id: 'cv6',
        title: 'NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis',
        authors: ['Ben Mildenhall', 'Pratul P. Srinivasan', 'Matthew Tancik', 'Jonathan T. Barron', 'Ravi Ramamoorthi', 'Ren Ng'],
        abstract: 'We present Neural Radiance Fields (NeRF), a method that achieves state-of-the-art results for synthesizing novel views of complex scenes by optimizing an underlying continuous volumetric scene function.',
        category: 'cv',
        publishDate: '2023-08-03',
        conference: 'ECCV 2023',
        url: 'https://arxiv.org/abs/2003.08934'
      },
      {
        id: '4',
        title: 'ViT: An Image is Worth 16x16 Words',
        authors: ['Google Research'],
        abstract: 'While the Transformer architecture has become the de-facto standard for natural language processing tasks, its applications to computer vision remain limited. We show that this reliance on CNNs is not necessary.',
        category: 'cv',
        publishDate: '2020-10-22',
        conference: 'ICLR 2021',
        url: 'https://arxiv.org/abs/2010.11929'
      },
      {
        id: '13',
        title: 'Sora: Creating Video From Text',
        authors: ['OpenAI'],
        abstract: 'We introduce Sora, a text-to-video model capable of generating highly realistic videos up to a minute long. The model demonstrates understanding of complex scenes, camera movements, and consistent physical dynamics.',
        category: 'cv',
        publishDate: '2024-02-15',
        conference: 'OpenAI Blog',
        url: 'https://openai.com/sora'
      },
      {
        id: '14',
        title: 'DALL·E 3: Improving Image Generation with Better Text Understanding',
        authors: ['OpenAI'],
        abstract: 'DALL·E 3 represents a significant advancement in text-to-image generation, featuring improved understanding of complex prompts and better adherence to text instructions while maintaining high image quality.',
        category: 'cv',
        publishDate: '2023-09-20',
        conference: 'OpenAI Blog',
        url: 'https://openai.com/dall-e-3'
      }
    ]
  },
  {
    id: 'ai-safety',
    name: 'AI Safety & Ethics',
    papers: [
      {
        id: '15',
        title: 'Frontier AI Regulation: Managing Emerging Risks to Public Safety',
        authors: ['UK Government'],
        abstract: 'This white paper outlines the UK\'s approach to regulating frontier AI systems, focusing on safety evaluation, risk management, and ensuring responsible development of advanced AI technologies.',
        category: 'ai-safety',
        publishDate: '2024-02-27',
        conference: 'UK Government Publication',
        url: 'https://www.gov.uk/government/publications/ai-regulation'
      },
      {
        id: '16',
        title: 'The AI Safety Landscape: Challenges and Opportunities',
        authors: ['DeepMind Ethics Team'],
        abstract: 'A comprehensive review of current challenges in AI safety, including alignment, robustness, and transparency. The paper presents a framework for evaluating and mitigating risks in advanced AI systems.',
        category: 'ai-safety',
        publishDate: '2024-01-15',
        conference: 'arXiv',
        url: 'https://arxiv.org/abs/2401.13023'
      }
    ]
  },
  {
    id: 'ai-applications',
    name: 'AI Applications',
    papers: [
      {
        id: '17',
        title: 'AlphaFold 3: Advancing Protein Structure Prediction',
        authors: ['DeepMind'],
        abstract: 'The latest iteration of AlphaFold introduces significant improvements in protein structure prediction accuracy and extends capabilities to predict protein complexes and interactions with other molecules.',
        category: 'ai-applications',
        publishDate: '2024-01-30',
        conference: 'Nature',
        url: 'https://www.nature.com/articles/s41586-024-07095-8'
      },
      {
        id: '18',
        title: 'AI in Climate Science: Improving Weather Prediction and Climate Modeling',
        authors: ['Google Research', 'NOAA'],
        abstract: 'A collaborative study demonstrating how AI models can significantly improve weather forecasting accuracy and climate change predictions through better pattern recognition and data processing.',
        category: 'ai-applications',
        publishDate: '2024-02-20',
        conference: 'Science',
        url: 'https://www.science.org/doi/10.1126/science.adg7492'
      }
    ]
  }
];