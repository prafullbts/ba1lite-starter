import { cn } from '@/lib/utils';

interface DecisionPageImageProps {
  imageSrc: string;
  alt: string;
  className?: string;
  objectPosition?: string;
}

export function DecisionPageImage({ imageSrc, alt, className, objectPosition = 'center' }: DecisionPageImageProps) {
  return (
    <div className={cn("w-full rounded-lg overflow-hidden shadow-lg max-h-[250px]", className)}>
      <img 
        src={imageSrc} 
        alt={alt} 
        className="w-full h-full object-cover"
        style={{ objectPosition }}
      />
    </div>
  );
}
