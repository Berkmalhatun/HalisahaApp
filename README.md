
# Halisaha Kiralama Sistemi

Java tabanlı bir mikroservis mimarisi geliştirerek futbol sahası kiralama sistemi üzerinde çalıştım. Bu sistem, kullanıcıların futbol sahalarını kolayca kiralamalarını sağlayan kapsamlı bir platformdur. Projenin temelinde, kullanıcıların veri tabanıyla etkileşimini sağlayan CRUD (oluşturma, güncelleme, silme ve okuma) işlemlerini başarıyla gerçekleştirdim.

Sistemde, kullanıcılara özgü rol atamaları yaptım ve giriş sonrası token bazlı rol doğrulaması ile güvenlik sağladım. Bu, kullanıcıların yetkilerini etkin bir şekilde yönetmemizi sağladı. Özellikle, kullanıcılara bölgesel olarak uygun futbol sahalarını listeleme özelliği ekledim, bu sayede kullanıcılar ihtiyaçlarına en uygun sahayı kolayca bulabildiler.

Projede ayrıca, 'Halısaha Yöneticisi' rolüne sahip kullanıcılar için özel işlevler geliştirdim. Bu kullanıcılar, kendi sahalarını sisteme ekleyebilir, düzenleyebilir

ve kiralama işlemlerini yönetebilirler. Ayrıca, kiralanmış sahaları kullanan kişilerin bilgilerini görüntüleme yetkilerine sahiptirler. Bu özellik, halı saha yöneticilerine sahalarını daha etkin bir şekilde yönetme imkanı tanıdı.

Sistemin bir diğer önemli özelliği ise, misafir kullanıcı işlevselliğidir. Sistem dışından yapılan kiralama işlemleri için, misafir kullanıcılar olarak sisteme ekleme yapılabilir. Bu sayede, platform dışından gerçekleşen işlemler de kayıt altına alınarak, işlemlerin şeffaflığı ve izlenebilirliği artırıldı.

Projenin teknoloji yelpazesi oldukça geniştir. Java, Spring Boot ve Spring Security başta olmak üzere, Lombok, Mapstruct, OpenAPI, Swagger UI, OpenFeign, RabbitMQ, MongoDB, JWT ve React gibi teknolojileri kullanarak, güçlü ve esnek bir sistem inşa ettim. Bu proje, modern web geliştirme pratiklerine olan hakimiyetimi ve çeşitli araçları entegre etme yeteneğimi göstermektedir.

 ## Proje Nasıl Klonlanır?

1. Bilgisayarınızda Git'in yüklü olması gerekmektedir.

2. Komut istemcisini açın.

3. Projeyi klonlamak istediğiniz dizine gidin, aşağıdaki komutu istemcinize yazın.


```bash 
git clone https://github.com/Berkmalhatun/HalisahaApp
```
4. Kullanmış olduğunuz IDE'yi açın  
5. Klonlamış olduğunuz dosyayı IDE üzerinden açın.
6. Terminale girip aşağıdaki komut ile `package.json` dosyasında listelenen tüm bağımlılıklar yüklenir.
```bash 
npm install
```
7. Proje yerel geliştirme sunucusunda aşağıdaki kod ile açılır.
```bash 
npm start
```

## Son
İnceleyip zaman ayırdığınız için teşekkür ederim.
